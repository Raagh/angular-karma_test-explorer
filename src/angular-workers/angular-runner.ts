import { KarmaHelper } from "../karma-workers/karma-helper";

export class AngularRunner {
  private readonly karmaHelper: KarmaHelper;
  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string, private userKarmaConfigFilePath: string) {
    this.karmaHelper = KarmaHelper.getInstance();
  }

  public async start(): Promise<void> {
    if (!this.karmaHelper.isValidKarmaConfig(this.baseKarmaConfigFilePath)) {
      global.console.log("The karma.conf.js used is not valid");
      return;
    }

    const cliArgs = ["test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];

    await this.runNgTest(cliArgs);
  }

  private async runNgTest(cliArgs: any): Promise<void> {
    const command = `ng ${cliArgs.join(" ")}`;
    global.console.log(`Starting Angular tests: ${command}`);

    const exec = require("child_process").exec;
    exec(command, {
      cwd: this.angularProjectRootPath,
    });
  }
}
