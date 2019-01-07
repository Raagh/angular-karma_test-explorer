import { AngularRunner } from "./angular-runner";
import { KarmaTestsRunner } from "./karma-tests-runner";
import { AngularReporter } from "./angular-reporter";
import explorerKarmaConfig = require("./test-explorer-karma.conf");

export class TestExplorer {
  private readonly testRunner: KarmaTestsRunner;
  private readonly angularProjectRootPath: string = "/Users/pferraggi/Documents/GitHub/torneo-luefi.web";
  private readonly baseKarmaConfigPath: string = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/out/test-explorer-karma.conf.js";

  public constructor() {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.testRunner = KarmaTestsRunner.getInstance();
    this.listenToServerStart();
    this.listenToBrowserReady();
    this.listenToError();
  }

  public async LoadTests(): Promise<void> {
    const angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath, "");

    await angularRunner.start();

    await this.testRunner.runServer();
  }

  public RunTests(): void {
    throw new Error("Not Implemented");
  }

  public DebugTests(): void {
    throw new Error("Not Implemented");
  }

  private listenToServerStart() {
    AngularReporter.instance.on("server_start", (port: number) => {
      global.console.log("server_start on port " + port);
    });
    AngularReporter.instance.on("server_start", () => {
      global.console.log("server_start");
    });
  }

  private listenToBrowserReady() {
    AngularReporter.instance.on("browsers_ready", () => {
      global.console.log("browsers_ready");
    });
  }

  private listenToError() {
    AngularReporter.instance.on("browser_error", (error: string) => {
      global.console.log("browser_error");
    });
    AngularReporter.instance.on("compile_error", (errors: string[]) => {
      global.console.log("compile_error");
    });
  }
}
