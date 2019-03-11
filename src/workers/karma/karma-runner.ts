import * as karma from "karma";
import { KarmaEventListener } from "./karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import path = require("path");

export class KarmaRunner {
  private readonly karmaEventListener: KarmaEventListener;
  private readonly angularProjectRootPath: string;

  public constructor(angularProjectRootPath: string) {
    this.karmaEventListener = KarmaEventListener.getInstance();
    this.angularProjectRootPath = angularProjectRootPath;
  }

  public isKarmaRunning(): boolean {
    return this.karmaEventListener.isServerLoaded;
  }

  public async waitTillKarmaIsRunning(eventEmitter: any): Promise<void> {
    await this.karmaEventListener.listenTillKarmaReady(eventEmitter);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    await this.runForLoading();

    return this.karmaEventListener.getLoadedTests();
  }

  public stopServer(): void {
    karma.stopper.stop();
  }

  public async runTests(tests: any): Promise<void> {
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
    await this.runWithConfig(config, tests);

    this.karmaEventListener.lastRunTests = tests !== "" ? tests[0] : tests;
  }

  private async runWithConfig(config: any, tests: any): Promise<void> {
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

      const request = http.request(options, (response: any) => {
        response.on("data", (buffer: any) => {
          resolve();
        });
      });

      request.on("error", (e: any) => {
        if (e.code === "ECONNREFUSED") {
          global.console.error("There is no server listening on port %d", options.port);
        }
      });

      const updateKarmaRequest = JSON.stringify({
        args: config.clientArgs,
        removedFiles: config.removedFiles,
        changedFiles: config.changedFiles,
        addedFiles: config.addedFiles,
        refresh: config.refresh,
      });

      request.end(updateKarmaRequest);
    });
  }

  private runForLoading(): Promise<void> {
    return new Promise<void>(resolve => {
      karma.runner.run({ port: 9876 }, (exitCode: number) => {
        global.console.log("karma run done with ", exitCode);
        resolve();
      });
    });
  }
}
