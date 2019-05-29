import { KarmaRunner } from "./karma/karma-runner";
import { KarmaHelper } from "./karma/karma-helper";
import { KarmaEventListener } from "./integration/karma-event-listener";
import { Logger } from "./shared/logger";
import { AngularServer } from "./angular/angular-server";
import { TestExplorerHelper } from "./test-explorer/test-explorer-helper";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestExplorerConfiguration } from "../model/test-explorer-configuration";

export class AngularKarmaTestExplorer {
  public constructor(
    private readonly karmaRunner: KarmaRunner,
    private readonly karmaHelper: KarmaHelper,
    private readonly logger: Logger,

    private readonly angularServer: AngularServer,
    private readonly testExplorerHelper: TestExplorerHelper,
    private readonly karmaEventListener: KarmaEventListener
  ) {}

  public async loadTests(config: TestExplorerConfiguration): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(config.angularProjectPath)) {
      return {} as TestSuiteInfo;
    }

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopAsync();
    }

    this.logger.info("Test Loading started...");

    await this.angularServer.start(config);

    const testSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("root", "Angular");
    testSuiteInfo.children = await this.karmaRunner.loadTests();

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

  public dispose(): void {
    if (this.karmaRunner.isKarmaRunning()) {
      this.angularServer.stop();
    }
  }
}
