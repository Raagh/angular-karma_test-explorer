import { KarmaHelper } from "../karma-workers/karma-helper";
import explorerKarmaConfig = require("../config/test-explorer-karma.conf");

export class AngularRunner {
  private readonly karmaHelper: KarmaHelper;
  private readonly commandLine: any;
  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string, private userKarmaConfigFilePath: string) {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.karmaHelper = KarmaHelper.getInstance();
  }

  public async start(): Promise<void> {
    if (!this.karmaHelper.isValidKarmaConfig(this.baseKarmaConfigFilePath)) {
      global.console.log("The karma.conf.js used is not valid");
      return;
    }

    const localPath = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/src/karma-workers/fakeTest.spec.ts";
    const remotePath = this.angularProjectRootPath + "/src/app/fakeTest.spec.ts";

    this.createTestFileForSkippingEverything(localPath, remotePath);

    this.runNgTest();
  }

  public cleanUp(): void {
    const localPath = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/src/karma-workers/fakeTest.spec.ts";
    const remotePath = this.angularProjectRootPath + "/src/app/fakeTest.spec.ts";
    this.removeTestFileForSkippingEverything(localPath, remotePath);

    this.commandLine.kill();
  }

  private removeTestFileForSkippingEverything(localPath: string, remotePath: string) {
    const fs = require("fs");
    if (fs.existsSync(remotePath)) {
      fs.unlinkSync(remotePath);
    }
  }

  private createTestFileForSkippingEverything(localPath: string, remotePath: string) {
    const fs = require("fs");
    if (fs.existsSync(localPath) && !fs.existsSync(remotePath)) {
      fs.copyFileSync(localPath, remotePath);
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
