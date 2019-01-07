import { AngularRunner } from "./angular-runner";
import { KarmaTestsRunner } from "./karma-tests-runner";
import explorerKarmaConfig = require("./test-explorer-karma.conf");
import { InterComunicator } from "./inter-comunicator";

export class TestExplorer {
  private readonly testRunner: KarmaTestsRunner;
  private readonly comunicator: InterComunicator;
  private readonly angularProjectRootPath: string = "/Users/pferraggi/Documents/GitHub/torneo-luefi.web";
  private readonly baseKarmaConfigPath: string = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/out/test-explorer-karma.conf.js";

  private constructor() {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.testRunner = KarmaTestsRunner.getInstance();
    this.comunicator = new InterComunicator();
  }

  public async loadTests(): Promise<void> {
    const angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath, "");

    this.comunicator.startListening();

    await angularRunner.start();

    await this.testRunner.runServer();
  }

  public runTests(): void {
    throw new Error("Not Implemented");
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
