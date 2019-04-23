import { EventEmitter } from "./workers/test-explorer/event-emitter";
import * as vscode from "vscode";
import { AngularServer } from "./workers/servers/angular-server";
import { KarmaRunner } from "./workers/karma/karma-runner";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { KarmaHelper } from "./workers/karma/karma-helper";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import { Logger } from "./workers/test-explorer/logger";
import path = require("path");
import { KarmaEventListener } from "./workers/karma/karma-event-listener";

export class AngularTestExplorer {
  private readonly karmaRunner: KarmaRunner;
  private readonly angularServer: AngularServer;
  private readonly baseKarmaConfigPath: string = path.join(__dirname, ".", "config", "test-explorer-karma.conf.js");
  private readonly eventEmitter: EventEmitter;
  private readonly karmaHelper: KarmaHelper;
  private readonly logger: Logger;
  private karmaEventListener: KarmaEventListener;

  public constructor(
    private readonly angularProjectRootPath: string,
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    channel: vscode.OutputChannel
  ) {
    this.logger = new Logger(channel);
    this.karmaHelper = new KarmaHelper();
    this.karmaRunner = new KarmaRunner(channel);
    this.angularServer = new AngularServer(this.angularProjectRootPath, this.baseKarmaConfigPath, channel);
    this.eventEmitter = new EventEmitter(eventEmitterInterface);
    this.karmaEventListener = KarmaEventListener.getInstance(channel);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(this.angularProjectRootPath)) {
      return {} as TestSuiteInfo;
    }

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun();
    }

    this.angularServer.start();

    this.logger.info("Test Loading started...");

    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);

    const result = await this.karmaRunner.loadTests();

    this.logger.info("Test Loading completed!");

    return result;
  }

  public async runTests(tests: any): Promise<void> {
    await this.karmaRunner.runTests(tests);

    const { testStatus, runCompleteEvent } = this.karmaEventListener;

    this.logger.status(testStatus);

    this.logger.info("Run completed with status: " + runCompleteEvent.results);
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
