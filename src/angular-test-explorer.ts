import * as vscode from "vscode";
import { AngularRunner } from "./angular-workers/angular-runner";
import { KarmaHelper } from "./karma-workers/karma-helper";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import path = require("path");

export class AngularTestExplorer {
  private readonly karmaHelper: KarmaHelper;
  private readonly angularRunner: AngularRunner;
  private readonly baseKarmaConfigPath: string = path.join(__dirname, ".", "config", "test-explorer-karma.conf.js");

  public constructor(
    private readonly angularProjectRootPath: string,
    private readonly eventEmitter: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
  ) {
    this.karmaHelper = new KarmaHelper(this.angularProjectRootPath);
    this.angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isServerLoaded()) {
      const isAngularStarted = this.angularRunner.start();
      if (!isAngularStarted) {
        return {} as TestSuiteInfo;
      }
      await this.karmaHelper.waitTillServerReady(this.eventEmitter);
    }

    this.angularRunner.setup();
    const result = await this.karmaHelper.loadTests();
    this.angularRunner.cleanUp();

    return result;
  }

  public async runTests(tests: any): Promise<void> {
    // await this.karmaHelper.runWithConsole(tests);
    // await this.karmaHelper.runWithBrowserRequest(tests);
    await this.karmaHelper.runWithModule();
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
