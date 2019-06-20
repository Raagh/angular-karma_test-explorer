import { IOCContainer } from "./infrastructure/ioc-container";
import * as vscode from "vscode";
import {
  TestAdapter,
  TestLoadStartedEvent,
  TestLoadFinishedEvent,
  TestRunStartedEvent,
  TestRunFinishedEvent,
  TestSuiteEvent,
  TestEvent,
} from "vscode-test-adapter-api";
import { Log } from "vscode-test-adapter-util";
import { AngularKarmaTestExplorer } from "./core/angular-karma-test-explorer";
import { TestExplorerConfiguration } from "./model/test-explorer-configuration";
import { ProjectType } from "./model/enums/project-type.enum";

export class Adapter implements TestAdapter {
  public config: TestExplorerConfiguration = {} as TestExplorerConfiguration;
  private disposables: Array<{ dispose(): void }> = [];
  private readonly testsEmitter = new vscode.EventEmitter<TestLoadStartedEvent | TestLoadFinishedEvent>();
  private readonly testStatesEmitter = new vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>();
  private readonly autorunEmitter = new vscode.EventEmitter<void>();
  private readonly testExplorer: AngularKarmaTestExplorer;

  get tests(): vscode.Event<TestLoadStartedEvent | TestLoadFinishedEvent> {
    return this.testsEmitter.event;
  }
  get testStates(): vscode.Event<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent> {
    return this.testStatesEmitter.event;
  }
  get autorun(): vscode.Event<void> | undefined {
    return this.autorunEmitter.event;
  }

  constructor(public readonly workspace: vscode.WorkspaceFolder, private readonly log: Log, channel: vscode.OutputChannel, projectType: ProjectType) {
    this.log.info("Initializing adapter");
    this.disposables.push(this.testsEmitter);
    this.disposables.push(this.testStatesEmitter);
    this.disposables.push(this.autorunEmitter);
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration(async configChange => {
        this.log.info("Configuration changed");

        if (
          configChange.affectsConfiguration("angularKarmaTestExplorer.defaultAngularProjectName", this.workspace.uri) ||
          configChange.affectsConfiguration("angularKarmaTestExplorer.defaultSocketConnectionPort", this.workspace.uri) ||
          configChange.affectsConfiguration("angularKarmaTestExplorer.projectRootPath", this.workspace.uri) ||
          configChange.affectsConfiguration("angularKarmaTestExplorer.karmaConfFilePath", this.workspace.uri) ||
          configChange.affectsConfiguration("angularKarmaTestExplorer.projectType", this.workspace.uri)
        ) {
          this.log.info("Sending reload event");

          this.load();
        }
      })
    );

    this.loadConfig();
    const container = new IOCContainer();
    this.testExplorer = container.registerTestExplorerDependencies(
      this.testStatesEmitter,
      channel,
      vscode.workspace.getConfiguration("angularKarmaTestExplorer", workspace.uri).get("debugMode") as boolean,
      projectType
    );
  }

  public async load(angularProject?: string): Promise<void> {
    this.loadConfig();
    this.log.info("Loading tests");

    this.testsEmitter.fire({ type: "started" } as TestLoadStartedEvent);

    if (angularProject !== undefined) {
      this.config.defaultAngularProjectName = angularProject;
    }

    const loadedTests = await this.testExplorer.loadTests(this.config);

    this.testsEmitter.fire({ type: "finished", suite: loadedTests } as TestLoadFinishedEvent);
  }

  public async run(tests: string[]): Promise<void> {
    this.log.info(`Running tests ${JSON.stringify(tests)}`);

    this.testStatesEmitter.fire({ type: "started", tests } as TestRunStartedEvent);

    // in a "real" TestAdapter this would start a test run in a child process
    await this.testExplorer.runTests(tests);

    this.testStatesEmitter.fire({ type: "finished" } as TestRunFinishedEvent);
  }

  public async debug(tests: string[]): Promise<void> {
    // in a "real" TestAdapter this would start a test run in a child process and attach the debugger to it
    this.log.warn("debug() not implemented yet");
    this.testExplorer.debugTests(tests);
  }

  public cancel(): void {
    // in a "real" TestAdapter this would kill the child process for the current test run (if there is any)
    throw new Error("Method not implemented.");
  }

  public async dispose(): Promise<void> {
    this.testExplorer.dispose();

    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables = [];
  }

  private loadConfig() {
    const config = vscode.workspace.getConfiguration("angularKarmaTestExplorer", this.workspace.uri);
    this.config = new TestExplorerConfiguration(config, this.workspace.uri.path);
  }
}
