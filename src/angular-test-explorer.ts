import { KarmaTestsLoader } from "./workers/karma/karma-tests-loader";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent, TestSuiteInfo } from "vscode-test-adapter-api";
import { KarmaRunner } from "./workers/karma/karma-runner";
import { KarmaHelper } from "./workers/karma/karma-helper";
import { KarmaEventListener } from "./workers/karma/karma-event-listener";
import { Logger } from "./workers/test-explorer/logger";
import * as vscode from "vscode";
import { AngularServer } from "./workers/servers/angular-server";
import { EventEmitter } from "./workers/test-explorer/event-emitter";
import { TestExplorerHelper } from "./workers/test-explorer/test-explorer-helper";
import { KarmaHttpCaller } from './workers/karma/karma-http-caller';

export class AngularTestExplorer {
  private readonly karmaRunner: KarmaRunner;
  private readonly karmaHelper: KarmaHelper;
  private readonly logger: Logger;
  private readonly karmaTestsLoader: KarmaTestsLoader;
  private karmaEventListener: KarmaEventListener;

  public constructor(
    private readonly workspaceRootPath: string,
    baseKarmaConfigPath: string,
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    channel: vscode.OutputChannel,
    isDebugMode: boolean
  ) {
    // poor's man dependency injection
    this.karmaHelper = new KarmaHelper();
    this.logger = new Logger(channel, isDebugMode);
    this.karmaEventListener = new KarmaEventListener(this.logger, new EventEmitter(eventEmitterInterface));
    this.karmaRunner = new KarmaRunner(this.karmaEventListener, this.logger, new KarmaHttpCaller());

    this.karmaTestsLoader = new KarmaTestsLoader(
      baseKarmaConfigPath,
      this.workspaceRootPath,
      new AngularServer(this.karmaEventListener, this.logger),
      new TestExplorerHelper(),
      this.karmaRunner
    );
  }

  public async loadTests(defaultProjectName: string, defaultSocketPort: number): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(this.workspaceRootPath)) {
      return {} as TestSuiteInfo;
    }

    this.logger.info("Test Loading started...");

    const testSuiteInfo = await this.karmaTestsLoader.loadTestsFromDefaultProject(defaultProjectName, defaultSocketPort);

    this.logger.info("Test Loading completed!");

    return testSuiteInfo;
  }

  public async runTests(tests: string[]): Promise<void> {
    await this.karmaRunner.runTests(tests);

    const { testStatus, runCompleteEvent } = this.karmaEventListener;

    this.logger.status(testStatus);

    this.logger.info("Run completed with status: " + runCompleteEvent.results);
  }

  public debugTests(tests: string[]): void {
    throw new Error("Not Implemented");
  }
}
