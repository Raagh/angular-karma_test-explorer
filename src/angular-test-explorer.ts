import * as vscode from "vscode";
import { AngularServer } from "./workers/angular/angular-server";
import { KarmaRunner } from "./workers/karma/karma-runner";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import path = require("path");

export class AngularTestExplorer {
  private readonly karmaRunner: KarmaRunner;
  private readonly angularServer: AngularServer;
  private readonly baseKarmaConfigPath: string = path.join(__dirname, ".", "config", "test-explorer-karma.conf.js");

  public constructor(
    private readonly angularProjectRootPath: string,
    private readonly eventEmitter: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
  ) {
    this.karmaRunner = new KarmaRunner(this.angularProjectRootPath);
    this.angularServer = new AngularServer(this.angularProjectRootPath, this.baseKarmaConfigPath);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    this.angularServer.setup();

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun();
    }

    const hasAngularStarted = this.angularServer.start();
    if (!hasAngularStarted) {
      return {} as TestSuiteInfo;
    }

    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);

    const result = await this.karmaRunner.loadTests();
    this.angularServer.cleanUp();

    return result;
  }

  public async runTests(tests: any): Promise<void> {
    this.angularServer.cleanUp();

    await this.karmaRunner.runTests(tests);
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
