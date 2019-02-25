import { KarmaHelper } from "../karma/karma-helper";
import explorerKarmaConfig = require("../../config/test-explorer-karma.conf");
import path = require("path");
import { spawn, StdioOptions } from "child_process";

export class AngularServer {
  private readonly karmaHelper: KarmaHelper;
  private readonly localPath: string;
  private readonly remotePath: string;
  private angularProcess: any;

  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string) {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.karmaHelper = new KarmaHelper();
    this.localPath = path.join(__dirname, "..", "..", "..", "src", "workers", "karma", "fakeTest.spec.ts");
    this.remotePath = path.join(this.angularProjectRootPath.replace("/c:/", "c:\\"), "src", "app", "fakeTest.spec.ts");
  }

  public async stopPreviousRun(): Promise<void> {
    if (this.angularProcess != null) {
      this.angularProcess.stdin.pause();
      process.kill(-this.angularProcess.pid);
    }

    return new Promise<void>(resolve => {
      this.angularProcess.on("exit", (code: any, signal: any) => {
        global.console.log(`ng child process exited with code ${code} and signal ${signal}`);
        resolve();
      });
    });
  }

  public start(): any {
    if (!this.karmaHelper.isValidKarmaConfig(this.baseKarmaConfigFilePath)) {
      global.console.log("The karma.conf.js used is not valid");
      return false;
    }

    this.runNgTest();
    return this.angularProcess;
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

    const options = {
      stdio: ["pipe", "pipe", "pipe", "ipc"] as StdioOptions,
      cwd: this.angularProjectRootPath,
      shell: true,
      detached: true,
    };

    this.angularProcess = spawn("ng", cliArgs, options);

    //    cp.stdout.on('data', data => console.log(`stdout: ${data}`));
    //    cp.stderr.on('data', data => console.log(`stderr: ${data}`));
    this.angularProcess.on("error", (err: any) => global.console.log(`error from ng child process: ${err}`));
  }
}
