export class AngularRunner {
  private cliCommandLine: any;

  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string, private userKarmaConfigFilePath: string) {}

  public async start(): Promise<void> {
    if (!this.isValidKarmaConfig()) {
      global.console.log("The karma.conf.js used is not valid");
      return;
    }

    const cliArgs = ["test", `--karma-config=${require.resolve(this.baseKarmaConfigFilePath)}`];

    const command = `ng ${cliArgs.join(" ")}`;
    global.console.log(`Starting Angular tests: ${command}`);

    await this.runAngularCommand(command, cliArgs);
  }

  private async runAngularCommand(command: string, cliArgs: any): Promise<void> {
    this.runAngularThroughCommandLine(command);

    // this.runAngularThroughAngularCli(cliArgs);
  }

  // private runAngularThroughAngularCli(cliArgs: any) {
  //   let cli = require("@angular/cli");
  //   if ("default" in cli) {
  //     cli = cli.default;
  //   }
  //   cli({ args: cliArgs, inputStream: process.stdin, outputStream: process.stdout })
  //     .then((returnCode: number) => {
  //       if (returnCode > 0) {
  //         global.console.log("error");
  //         const runner = KarmaTestsRunner.getInstance();
  //         runner.stopServer();
  //       }
  //     })
  //     .catch((err: Error) => {
  //       global.console.error("Unknown error: " + err.toString());
  //       process.exit(127);
  //     });
  // }

  private runAngularThroughCommandLine(command: string) {
    const exec = require("child_process").exec;
    this.cliCommandLine = exec(command, {
      cwd: this.angularProjectRootPath,
    });
  }

  private isValidKarmaConfig(): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(this.baseKarmaConfigFilePath);

    return karmaConfig != null || karmaConfig !== undefined;
  }
}
