import { KarmaRunner } from "./workers/karma/karma-runner";
import { KarmaHelper } from "./workers/karma/karma-helper";
import { KarmaEventListener } from "./workers/karma/karma-event-listener";
import { Logger } from "./workers/shared/logger";
import { AngularServer } from "./workers/servers/angular-server";
import { TestExplorerHelper } from "./workers/test-explorer/test-explorer-helper";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class AngularKarmaTestExplorer {
  public constructor(
    private readonly karmaRunner: KarmaRunner,
    private readonly karmaHelper: KarmaHelper,
    private readonly logger: Logger,

    private readonly angularServer: AngularServer,
    private readonly testExplorerHelper: TestExplorerHelper,
    private readonly karmaEventListener: KarmaEventListener,
    private readonly workspaceRootPath: string,
    private readonly baseKarmaConfigPath: string
  ) {}

  public async loadTests(defaultProjectName: string, defaultSocketPort: number): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(this.workspaceRootPath)) {
      return {} as TestSuiteInfo;
    }

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stop();
    }

    this.logger.info("Test Loading started...");

    await this.angularServer.start(defaultProjectName, this.baseKarmaConfigPath, defaultSocketPort);

    const testSuiteInfo: TestSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("root", "Angular");
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
}
