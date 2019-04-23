import * as karma from "karma";
import { KarmaEventListener } from "./karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { EventEmitter } from "../test-explorer/event-emitter";
import { Logger } from "../test-explorer/logger";
import { OutputChannel } from "vscode";

export class KarmaRunner {
  private readonly karmaEventListener: KarmaEventListener;
  private readonly logger: Logger;

  public constructor(channel: OutputChannel) {
    this.logger = new Logger(channel);
    this.karmaEventListener = KarmaEventListener.getInstance(channel);
  }

  public isKarmaRunning(): boolean {
    return this.karmaEventListener.isServerLoaded;
  }

  public async waitTillKarmaIsRunning(eventEmitter: EventEmitter): Promise<void> {
    await this.karmaEventListener.listenTillKarmaReady(eventEmitter);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    const fakeTestPatternForSkippingEverything = "$#%#";
    const karmaRunParameters = this.createKarmaRunConfiguration(fakeTestPatternForSkippingEverything);
    this.karmaEventListener.lastRunTests = "";

    await this.runWithConfig(karmaRunParameters.config);

    return this.karmaEventListener.getLoadedTests();
  }

  public stopServer(): void {
    karma.stopper.stop();
  }

  public async runTests(tests: string[]): Promise<void> {
    this.log(tests);

    const karmaRunParameters = this.createKarmaRunConfiguration(tests);

    this.karmaEventListener.isTestRunning = true;
    this.karmaEventListener.lastRunTests = karmaRunParameters.tests;
    await this.runWithConfig(karmaRunParameters.config);
  }

  private log(tests: string[]): void {
    const [suit, ...description] = tests[0].split(" ");
    this.logger.info(`Running [ suite: ${suit}${description.length > 0 ? ", test: " + description.join(" ") : ""} ]`, {
      addDividerForKarmaLogs: true,
    });
  }

  private createKarmaRunConfiguration(tests: any) {
    // if testName is undefined, reset jasmine.getEnv().specFilter function
    // otherwise, last specified specFilter will be used
    if (tests[0] === "root" || tests[0] === undefined) {
      tests = "";
    }
    const serverPort = 9876;
    const urlRoot = "/run";
    const config = {
      port: serverPort,
      refresh: true,
      urlRoot,
      hostname: "localhost",
      clientArgs: [] as string[],
    };
    config.clientArgs = [`--grep=${tests}`];
    return { config, tests };
  }

  private runWithConfig(config: any): Promise<void> {
    return new Promise<void>(resolve => {
      const options = {
        hostname: config.hostname,
        path: config.urlRoot,
        port: config.port,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const http = require("http");

      const request = http.request(options);

      request.on("error", (e: any) => {
        if (e.code === "ECONNREFUSED") {
          global.console.error("There is no server listening on port %d", options.port);
        }
      });

      request.end(
        JSON.stringify({
          args: config.clientArgs,
          removedFiles: config.removedFiles,
          changedFiles: config.changedFiles,
          addedFiles: config.addedFiles,
          refresh: config.refresh,
        })
      );

      request.on("close", () => {
        resolve();
      });
    });
  }
}
