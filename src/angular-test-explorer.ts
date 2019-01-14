import { AngularRunner } from "./angular-workers/angular-runner";
import { KarmaHelper } from "./karma-workers/karma-helper";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class AngularTestExplorer {
  private readonly karmaHelper: KarmaHelper;
  private readonly baseKarmaConfigPath: string = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/out/config/test-explorer-karma.conf.js";

  public constructor(private readonly angularProjectRootPath: string) {
    this.karmaHelper = KarmaHelper.getInstance();

    const angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath, "");
    angularRunner.start();
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    await this.karmaHelper.startServer();
    await this.karmaHelper.runServer();

    return this.karmaHelper.getTests();
  }

  public async runTests(): Promise<void> {
    await this.karmaHelper.runServer();
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
