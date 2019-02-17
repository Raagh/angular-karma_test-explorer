import { KarmaHelper } from "../karma-workers/karma-helper";
import explorerKarmaConfig = require("../config/test-explorer-karma.conf");
import path = require("path");

export class AngularRunner {
  private readonly karmaHelper: KarmaHelper;
  private commandLine: any;
  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string, private userKarmaConfigFilePath: string) {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.karmaHelper = new KarmaHelper(this.angularProjectRootPath);
  }

  public start(): void {
    if (!this.karmaHelper.isValidKarmaConfig(this.baseKarmaConfigFilePath)) {
      global.console.log("The karma.conf.js used is not valid");
      return;
    }

    const localPath = path.join(__dirname, "..", "..", "src", "karma-workers", "fakeTest.spec.ts");
    const remotePath = this.angularProjectRootPath + "/src/app/fakeTest.spec.ts";

    this.createTestFileForSkippingEverything(localPath, remotePath);

    this.runNgTest();
  }

  public cleanUp(): void {
    const remotePath = this.angularProjectRootPath + "/src/app/fakeTest.spec.ts";
    this.removeTestFileForSkippingEverything(remotePath);

    // this.commandLine.kill();
  }

  private removeTestFileForSkippingEverything(remotePath: string) {
    const fs = require("fs");
    if (fs.existsSync(remotePath)) {
      fs.unlinkSync(remotePath);
    }
  }

  private createTestFileForSkippingEverything(localPath: string, remotePath: string) {
    const fs = require("fs");
    if (fs.existsSync(localPath) && !fs.existsSync(remotePath)) {
      fs.copyFileSync(localPath, remotePath, (err: any) => {
        global.console.log("error " + err);
      });
    }
  }

  private runNgTest(): void {
    const cliArgs = ["test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];
    const command = `ng ${cliArgs.join(" ")}`;
    global.console.log(`Starting Angular tests: ${command}`);

    const exec = require("child_process").exec;
    this.commandLine = exec(command, {
      cwd: this.angularProjectRootPath,
    });
  }
}
