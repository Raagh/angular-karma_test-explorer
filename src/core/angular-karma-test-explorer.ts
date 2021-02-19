import { KarmaRunner } from "./karma/karma-runner";
import { TestServerValidation } from "./test-server/test-server-validation";
import { KarmaEventListener } from "./integration/karma-event-listener";
import { Logger } from "./shared/logger";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestExplorerConfiguration } from "../model/test-explorer-configuration";
import { TestServer } from "../model/test-server";

export class AngularKarmaTestExplorer {
  private loadedProjectRootPath: string = "";
  public constructor(
    private readonly karmaRunner: KarmaRunner,
    private readonly testServerValidation: TestServerValidation,
    private readonly logger: Logger,
    private readonly testServer: TestServer,
    private readonly karmaEventListener: KarmaEventListener
  ) {}

  public async loadTests(config: TestExplorerConfiguration): Promise<TestSuiteInfo | undefined> {
    if (!this.testServerValidation.isValidProject(config.projectRootPath, config.projectType)) {
      return undefined;
    }

    if (this.karmaRunner.isKarmaRunning()) {
      await this.testServer.stopAsync();
    }

    this.loadedProjectRootPath = await this.testServer.start(config);

    const testSuiteInfo = await this.karmaRunner.loadTests(this.loadedProjectRootPath);

    if (testSuiteInfo.children.length === 0) {
      this.logger.info("Test loading completed - No tests found");
    } else {
      this.logger.info("Test loading completed");
    }

    return testSuiteInfo;
  }

  public async reloadTestDefinitions(): Promise<TestSuiteInfo> {
    await this.karmaRunner.loadTests(this.loadedProjectRootPath);

    // We have to call it twice to force karma reload the definitions
    // without having to enable autowatch = true;
    return await this.karmaRunner.loadTests(this.loadedProjectRootPath);
  }

  public async runTests(tests: string[], isComponentRun: boolean): Promise<void> {
    await this.karmaRunner.runTests(tests, isComponentRun);
    this.logger.status(this.karmaEventListener.testStatus);
  }

  public async stopCurrentRun(): Promise<void> {
    if (this.karmaRunner.isKarmaRunning()) {
      await this.testServer.stopAsync();
    }
  }

  public dispose(): void {
    if (this.karmaRunner.isKarmaRunning()) {
      this.testServer.stop();
    }
  }
}
