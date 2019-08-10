import { KarmaHttpClient } from "../integration/karma-http-client";
import { Logger } from "../shared/logger";
import { KarmaEventListener } from "../integration/karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class KarmaRunner {
  public constructor(
    private readonly karmaEventListener: KarmaEventListener,
    private readonly logger: Logger,
    private readonly karmaHttpCaller: KarmaHttpClient
  ) {}

  public isKarmaRunning(): boolean {
    return this.karmaEventListener.isServerLoaded;
  }

  public async loadTests(projectRootPath: string): Promise<TestSuiteInfo> {
    const fakeTestPatternForSkippingEverything = "$#%#";
    const karmaRunParameters = this.karmaHttpCaller.createKarmaRunCallConfiguration(fakeTestPatternForSkippingEverything);
    this.karmaEventListener.lastRunTests = "";

    await this.karmaHttpCaller.callKarmaRunWithConfig(karmaRunParameters.config);

    return this.karmaEventListener.getLoadedTests(projectRootPath);
  }

  public async runTests(tests: string[], isComponentRun: boolean): Promise<void> {
    this.log(tests);

    const karmaRunParameters = this.karmaHttpCaller.createKarmaRunCallConfiguration(tests);

    this.karmaEventListener.isTestRunning = true;
    this.karmaEventListener.lastRunTests = karmaRunParameters.tests;
    this.karmaEventListener.isComponentRun = isComponentRun;
    await this.karmaHttpCaller.callKarmaRunWithConfig(karmaRunParameters.config);
  }

  public async stopRun() {
    return new Promise<void>(resolve => {
      const stopper = require("karma").stopper;
      stopper.stop({ port: 9876 }, (exitCode: any) => {
        resolve();
      });
    });
  }

  private log(tests: string[]): void {
    const [suit, ...description] = tests[0].split(" ");
    this.logger.info(`Running [ suite: ${suit}${description.length > 0 ? ", test: " + description.join(" ") : ""} ]`, {
      addDividerForKarmaLogs: true,
    });
  }
}
