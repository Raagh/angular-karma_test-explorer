import { KarmaHelper } from "../karma-workers/karma-helper";
import explorerKarmaConfig = require("../config/test-explorer-karma.conf");
import path = require("path");
import { spawn } from "child_process";

export class AngularRunner {
  private readonly karmaHelper: KarmaHelper;
  private readonly localPath: string;
  private readonly remotePath: string;
  private angularCommandLine: any;

  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string) {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.karmaHelper = new KarmaHelper(this.angularProjectRootPath);
    this.localPath = path.join(__dirname, "..", "..", "src", "karma-workers", "fakeTest.spec.ts");
    this.remotePath = path.join(this.angularProjectRootPath.replace("/c:/", "c:\\"), "src", "app", "fakeTest.spec.ts");
  }

  public async stopPreviousRun(): Promise<void> {
    if (this.angularCommandLine != null) {
      this.angularCommandLine.stdin.pause();
      process.kill(-this.angularCommandLine.pid);
    }

    return new Promise<void>(resolve => {
      this.angularCommandLine.on("exit", (code: any, signal: any) => {
        global.console.log(`ng child process exited with code ${code} and signal ${signal}`);
        resolve();
      });
    });
  }

  public start(): boolean {
    if (!this.karmaHelper.isValidKarmaConfig(this.baseKarmaConfigFilePath)) {
      global.console.log("The karma.conf.js used is not valid");
      return false;
    }

    this.runNgTest();
    return true;
  }

  public setup(): void {
    const fs = require("fs");
    if (fs.existsSync(this.localPath) && !fs.existsSync(this.remotePath)) {
      fs.copyFileSync(this.localPath, this.remotePath, (err: any) => {
        global.console.log("error " + err);
      });
    }
  }

  public cleanUp(): void {
    const fs = require("fs");
    if (fs.existsSync(this.remotePath)) {
      fs.unlinkSync(this.remotePath);
    }
  }

  private runNgTest(): void {
    const cliArgs = ["test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];
    global.console.log(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    this.angularCommandLine = spawn("ng", cliArgs, { cwd: this.angularProjectRootPath, shell: true, detached: true });

    //    cp.stdout.on('data', data => console.log(`stdout: ${data}`));
    //    cp.stderr.on('data', data => console.log(`stderr: ${data}`));
    this.angularCommandLine.on("error", (err: any) => global.console.log(`error from ng child process: ${err}`));
  }
}
