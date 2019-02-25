import * as karma from "karma";
import { KarmaEventListener } from "./karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { KarmaHelper } from "./karma-helper";

export class KarmaRunner {
  private readonly karmaEventListener: KarmaEventListener;
  private readonly angularProjectRootPath: string;
  private readonly karmaHelper: KarmaHelper;

  public constructor(angularProjectRootPath: string) {
    this.karmaEventListener = KarmaEventListener.getInstance();
    this.angularProjectRootPath = angularProjectRootPath;
    this.karmaHelper = new KarmaHelper();
  }

  public isKarmaRunning(): boolean {
    return this.karmaEventListener.isServerLoaded;
  }

  public async waitTillKarmaIsRunning(eventEmitter: any, angularProcess: any): Promise<void> {
    await this.karmaEventListener.listenTillKarmaReady(eventEmitter, angularProcess);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    await this.runWithModule();

    return this.karmaEventListener.getLoadedTests();
  }

  public async runWithModule(): Promise<void> {
    return new Promise<void>(resolve => {
      karma.runner.run({ port: 9876 }, (exitCode: number) => {
        global.console.log("karma run done with ", exitCode);
        resolve();
      });
    });
  }

  public async runWithBrowserRequest(tests: any): Promise<void> {
    const serverPort = 9876;
    const urlRoot = "/run";
    const config = {
      port: serverPort,
      refresh: true,
      urlRoot,
      hostname: "localhost:9876",
      clientArgs: [] as string[],
    };
    const testName = "";
    // if testName is undefined, reset jasmine.getEnv().specFilter function
    // otherwise, last specified specFilter will be used
    config.clientArgs = ["--grep=" + (testName || "")];
    await this.runWithConfig(config, tests);
  }

  public async runWithConsole(tests: any): Promise<void> {
    const command = "karma run -- --grep=";
    const exec = require("child_process").exec;
    exec(command, {
      cwd: this.angularProjectRootPath + "/node_modules/karma/bin/",
    });
  }

  public stopServer(): void {
    karma.stopper.stop();
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
        rejectUnauthorized: false,
      };

      const http = require("http");

      const request = http.request(options, (response: any) => {
        response.on("data", (buffer: any) => {
          const parsedResult = this.karmaHelper.parseExitCode(buffer, 1, false);
          global.console.log(parsedResult.exitCode);
          global.console.log(parsedResult.buffer.toString("utf8"));
        });

        response.on("end", () => resolve());
      });

      request.on("error", (e: any) => {
        if (e.code === "ECONNREFUSED") {
          global.console.error("There is no server listening on port %d", options.port);
        } else {
          throw e;
        }
      });
    });
  }
}
