import { AngularRunner } from "./angular-workers/angular-runner";
import { KarmaCLI } from "./karma-workers/karma-cli";
import explorerKarmaConfig = require("./config/test-explorer-karma.conf");
import { KarmaEventListener } from "./karma-workers/karma-event-listener";

export class AngularTestExplorer {
  private readonly karmaCLI: KarmaCLI;
  private readonly karmaEventListener: KarmaEventListener;
  private readonly angularProjectRootPath: string = "/Users/pferraggi/Documents/GitHub/torneo-luefi.web";
  private readonly baseKarmaConfigPath: string = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/out/config/test-explorer-karma.conf.js";

  public constructor() {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.karmaCLI = KarmaCLI.getInstance();
    this.karmaEventListener = new KarmaEventListener();
    this.karmaEventListener.startListening();
    const angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath, "");
    angularRunner.start();
  }

  public async loadTests(): Promise<void> {
    await this.karmaCLI.runServer();
  }

  public runTests(): void {
    throw new Error("Not Implemented");
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
