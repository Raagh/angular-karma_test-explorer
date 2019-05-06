import { KarmaHttpCaller } from "./karma-http-caller";
import { Logger } from "./../test-explorer/logger";
import { KarmaEventListener } from "./karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class KarmaRunner {
  public constructor(
    private readonly karmaEventListener: KarmaEventListener,
    private readonly logger: Logger,
    private readonly karmaHttpCaller: KarmaHttpCaller
  ) {}

  public isKarmaRunning(): boolean {
    return this.karmaEventListener.isServerLoaded;
  }

  public async waitTillKarmaIsRunning(defaultSocketPort?: number): Promise<void> {
    await this.karmaEventListener.listenTillKarmaReady(defaultSocketPort);
  }

  public async loadTests(): Promise<TestSuiteInfo[]> {
    const fakeTestPatternForSkippingEverything = "$#%#";
    const karmaRunParameters = this.karmaHttpCaller.createKarmaRunCallConfiguration(fakeTestPatternForSkippingEverything);
    this.karmaEventListener.lastRunTests = "";

    await this.karmaHttpCaller.callKarmaRunWithConfig(karmaRunParameters.config);

    return this.karmaEventListener.getLoadedTests();
  }

  public async runTests(tests: string[]): Promise<void> {
    this.log(tests);

    const karmaRunParameters = this.karmaHttpCaller.createKarmaRunCallConfiguration(tests);

    this.karmaEventListener.isTestRunning = true;
    this.karmaEventListener.lastRunTests = karmaRunParameters.tests;
    await this.karmaHttpCaller.callKarmaRunWithConfig(karmaRunParameters.config);
  }

  private log(tests: string[]): void {
    const [suit, ...description] = tests[0].split(" ");
    this.logger.info(`Running [ suite: ${suit}${description.length > 0 ? ", test: " + description.join(" ") : ""} ]`, {
      addDividerForKarmaLogs: true,
    });
  }
}
