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
import { AngularTestExplorer } from "./angular-test-explorer";
import { Logger } from "./workers/test-explorer/logger";
import { KarmaEventListener } from "./workers/karma/karma-event-listener";
import path = require("path");

export class Adapter implements TestAdapter {
  private disposables: Array<{ dispose(): void }> = [];
  private karmaEventListener: KarmaEventListener;

  private readonly testsEmitter = new vscode.EventEmitter<TestLoadStartedEvent | TestLoadFinishedEvent>();
  private readonly testStatesEmitter = new vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>();
  private readonly autorunEmitter = new vscode.EventEmitter<void>();
  private readonly testExplorer: AngularTestExplorer;

  get tests(): vscode.Event<TestLoadStartedEvent | TestLoadFinishedEvent> {
    return this.testsEmitter.event;
  }
  get testStates(): vscode.Event<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent> {
    return this.testStatesEmitter.event;
  }
  get autorun(): vscode.Event<void> | undefined {
    return this.autorunEmitter.event;
  }

  constructor(public readonly workspace: vscode.WorkspaceFolder, private readonly log: Log) {
    this.log.info("Initializing adapter");

    this.disposables.push(this.testsEmitter);
    this.disposables.push(this.testStatesEmitter);
    this.disposables.push(this.autorunEmitter);
    this.testExplorer = new AngularTestExplorer(path.join(workspace.uri.path.replace(/^\/([a-z]):\//, "$1:/")), this.testStatesEmitter);
    this.karmaEventListener = KarmaEventListener.getInstance();
  }

  public async load(): Promise<void> {
    this.log.info("Loading tests");

    this.testsEmitter.fire({ type: "started" } as TestLoadStartedEvent);
    Logger.info("Test Loading started...");

    const loadedTests = await this.testExplorer.loadTests();

    this.testsEmitter.fire({ type: "finished", suite: loadedTests } as TestLoadFinishedEvent);
    Logger.info("Test Loading completed!");
  }

  public async run(tests: string[]): Promise<void> {
    this.log.info(`Running tests ${JSON.stringify(tests)}`);

    this.testStatesEmitter.fire({ type: "started", tests } as TestRunStartedEvent);

    // in a "real" TestAdapter this would start a test run in a child process
    await this.testExplorer.runTests(tests);

    this.testStatesEmitter.fire({ type: "finished" } as TestRunFinishedEvent);
    const { testStatus, runCompleteEvent } = this.karmaEventListener;

    Logger.status(testStatus);

    Logger.info("Run completed with status: " + runCompleteEvent.results);
  }

  public async debug(tests: string[]): Promise<void> {
    // in a "real" TestAdapter this would start a test run in a child process and attach the debugger to it
    this.log.warn("debug() not implemented yet");
    throw new Error("Method not implemented.");
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
