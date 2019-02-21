import * as karma from "karma";
import { KarmaEventListener } from "./karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class KarmaHelper {
  private readonly karmaEventListener: KarmaEventListener;
  private readonly angularProjectRootPath: string;

  public constructor(angularProkectRootPath: string) {
    this.karmaEventListener = KarmaEventListener.getInstance();
    this.angularProjectRootPath = angularProkectRootPath;
  }

  public isServerLoaded(): boolean {
    return this.karmaEventListener.isServerLoaded;
  }

  public async waitTillServerReady(eventEmitter: any): Promise<void> {
    await this.karmaEventListener.listenTillKarmaReady(eventEmitter);
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    await this.runWithModule();

    return this.karmaEventListener.getTests();
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
      clientArgs: <string[]>[],
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

  public isValidKarmaConfig(karmaConfigFilePath: string): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(karmaConfigFilePath);

    return karmaConfig != null || karmaConfig !== undefined;
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
          const parsedResult = this.parseExitCode(buffer, 1, false);
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

  private parseExitCode(buffer: any, defaultExitCode: any, failOnEmptyTestSuite: any) {
    const EXIT_CODE = Buffer.from("\x1FEXIT");
    const tailPos = buffer.length - Buffer.byteLength(EXIT_CODE) - 2;

    if (tailPos < 0) {
      return { exitCode: defaultExitCode, buffer };
    }

    const tail = buffer.slice(tailPos);
    const tailStr = tail.toString();
    if (tailStr.substr(0, tailStr.length - 2) === EXIT_CODE) {
      const emptyInt = parseInt(tailStr.substr(-2, 1), 10);
      let exitCode = parseInt(tailStr.substr(-1), 10);
      if (failOnEmptyTestSuite === false && emptyInt === 0) {
        global.console.log("Test suite was empty.");
        exitCode = 0;
      }
      return { exitCode, buffer: buffer.slice(0, tailPos) };
    }

    return { exitCode: defaultExitCode, buffer };
  }
}
