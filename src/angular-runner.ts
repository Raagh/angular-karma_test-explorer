import * as karmaConf from "./karma.conf";
import { KarmaTestsRunner } from "./karma-tests-runner";

export class AngularRunner {
  public Start(): void {
    let cli = require("@angular/cli");

    if ("default" in cli) {
      cli = cli.default;
    }

    const configValidationResult = this.IsValidKarmaConfig();

    if (!configValidationResult) {
      global.console.log("The karma.conf.js used is not valid");
      return;
    }

    const cliArgs = ["test", "--progress=false", `--karma-config=${require.resolve("./karma.conf.js")}`];
    global.console.log(`Starting Angular tests: ${`ng ${cliArgs.join(" ")}`}`);

    cli({ args: cliArgs, inputStream: process.stdin, outputStream: process.stdout })
      .then((returnCode: number) => {
        if (returnCode > 0) {
          global.console.log("error");
        }
        const runner = KarmaTestsRunner.GetInstance();
        runner.StopServer();
      })
      .catch((err: Error) => {
        global.console.error("Unknown error: " + err.toString());
        process.exit(127);
      });
  }

  private IsValidKarmaConfig(): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig("/Users/pferraggi/Documents/GitHub/angular-test-explorer/out/karma.conf.js");

    return karmaConfig != null || karmaConfig !== undefined;
  }
}
