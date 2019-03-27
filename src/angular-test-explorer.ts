import { EventEmitter } from "./workers/test-explorer/event-emitter";
import * as vscode from "vscode";
import { AngularServer } from "./workers/servers/angular-server";
import { KarmaRunner } from "./workers/karma/karma-runner";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { KarmaHelper } from "./workers/karma/karma-helper";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import path = require("path");

export class AngularTestExplorer {
  private readonly karmaRunner: KarmaRunner;
  private readonly angularServer: AngularServer;
  private readonly baseKarmaConfigPath: string = path.join(__dirname, ".", "config", "test-explorer-karma.conf.js");
  private readonly eventEmitter: EventEmitter;
  private readonly karmaHelper: KarmaHelper;

  public constructor(
    private readonly angularProjectRootPath: string,
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
  ) {
    this.karmaHelper = new KarmaHelper();
    this.karmaRunner = new KarmaRunner();
    this.angularServer = new AngularServer(this.angularProjectRootPath, this.baseKarmaConfigPath);
    this.eventEmitter = new EventEmitter(eventEmitterInterface);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(this.angularProjectRootPath)) {
      return {} as TestSuiteInfo;
    }

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun();
    }

    this.angularServer.start();

    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);

    const result = await this.karmaRunner.loadTests();

    return result;
  }

  public async runTests(tests: any): Promise<void> {
    await this.karmaRunner.runTests(tests);
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
