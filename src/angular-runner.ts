import * as karmaConf from "./karma.conf";
import { KarmaTestsRunner } from "./karma-tests-runner";
import explorerKarmaConfig = require("./test-explorer-karma.conf");

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

    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });

    await this.runAngularCommand(command);
  }

  private async runAngularCommand(command: string): Promise<void> {
    const exec = require("await-exec");

    this.cliCommandLine = exec(command, {
      cwd: this.angularProjectRootPath,
      windowsHide: true,
    });

    // let cli = require("@angular/cli");

    // if ("default" in cli) {
    //   cli = cli.default;
    // }

    // cli({ args: cliArgs, inputStream: process.stdin, outputStream: process.stdout })
    //   .then((returnCode: number) => {
    //     if (returnCode > 0) {
    //       global.console.log("error");
    //       const runner = KarmaTestsRunner.GetInstance();
    //       runner.StopServer();
    //     }
    //   })
    //   .catch((err: Error) => {
    //     global.console.error("Unknown error: " + err.toString());
    //     process.exit(127);
    //   });
  }

  private isValidKarmaConfig(): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(this.baseKarmaConfigFilePath);

    return karmaConfig != null || karmaConfig !== undefined;
  }
}
