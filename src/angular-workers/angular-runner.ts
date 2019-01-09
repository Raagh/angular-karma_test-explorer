export class AngularRunner {
  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string, private userKarmaConfigFilePath: string) {}

  public async start(): Promise<void> {
    if (!this.isValidKarmaConfig()) {
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

  private isValidKarmaConfig(): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(this.baseKarmaConfigFilePath);

    return karmaConfig != null || karmaConfig !== undefined;
  }
}
