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
import { AngularKarmaTestExplorer } from "./angular_karma-test-explorer";
import path = require("path");

export class Adapter implements TestAdapter {
  private disposables: Array<{ dispose(): void }> = [];

  private readonly testsEmitter = new vscode.EventEmitter<TestLoadStartedEvent | TestLoadFinishedEvent>();
  private readonly testStatesEmitter = new vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>();
  private readonly autorunEmitter = new vscode.EventEmitter<void>();
  private readonly config: vscode.WorkspaceConfiguration;
  private readonly testExplorer: AngularKarmaTestExplorer;
  public readonly workspaceRootPath: string;

  get tests(): vscode.Event<TestLoadStartedEvent | TestLoadFinishedEvent> {
    return this.testsEmitter.event;
  }
  get testStates(): vscode.Event<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent> {
    return this.testStatesEmitter.event;
  }
  get autorun(): vscode.Event<void> | undefined {
    return this.autorunEmitter.event;
  }

  constructor(public readonly workspace: vscode.WorkspaceFolder, private readonly log: Log, channel: vscode.OutputChannel) {
    this.log.info("Initializing adapter");
    this.config = vscode.workspace.getConfiguration("angularKarmaTestExplorer", this.workspace.uri);

    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration(async configChange => {
        this.log.info("Configuration changed");

        if (
          configChange.affectsConfiguration("angularKarmaTestExplorer.defaultAngularProjectName", this.workspace.uri) ||
          configChange.affectsConfiguration("angularKarmaTestExplorer.defaultSocketConnectionPort", this.workspace.uri)
        ) {
          this.log.info("Sending reload event");

          this.load();
        }
      })
    );

    this.disposables.push(this.testsEmitter);
    this.disposables.push(this.testStatesEmitter);
    this.disposables.push(this.autorunEmitter);
    this.workspaceRootPath = path.join(workspace.uri.path.replace(/^\/([a-z]):\//, "$1:/"));
    const container = new IOCContainer();
    this.testExplorer = container.registerTestExplorerDependencies(
      this.testStatesEmitter,
      channel,
      this.config.get("debugMode") as boolean,
      this.workspaceRootPath,
      path.join(__dirname, ".", "config", "test-explorer-karma.conf.js")
    );
  }

  public async load(angularProject?: string): Promise<void> {
    this.log.info("Loading tests");

    this.testsEmitter.fire({ type: "started" } as TestLoadStartedEvent);

    if (angularProject === undefined) {
      angularProject = this.config.get("defaultAngularProjectName") as string;
    }

    const loadedTests = await this.testExplorer.loadTests(angularProject, this.config.get("defaultSocketConnectionPort") as number);

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

  public dispose(): void {
    this.cancel();
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables = [];
  }
}
