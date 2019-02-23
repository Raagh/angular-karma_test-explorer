import { KarmaHelper } from "../karma-workers/karma-helper";
import explorerKarmaConfig = require("../config/test-explorer-karma.conf");
import path = require("path");
import { spawn } from "child_process";

export class AngularRunner {
  private readonly karmaHelper: KarmaHelper;
  private readonly localPath: string;
  private readonly remotePath: string;

  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string) {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.karmaHelper = new KarmaHelper(this.angularProjectRootPath);
    this.localPath = path.join(__dirname, "..", "..", "src", "karma-workers", "fakeTest.spec.ts");
    this.remotePath = path.join(this.angularProjectRootPath.replace("/c:/", "c:\\"), "src", "app", "fakeTest.spec.ts");
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
    console.log(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    const cp = spawn("ng", cliArgs, { cwd: this.angularProjectRootPath, shell: true });

//    cp.stdout.on('data', data => console.log(`stdout: ${data}`));
//    cp.stderr.on('data', data => console.log(`stderr: ${data}`));
    cp.on('error', err => console.log(`error from ng child process: ${err}`));
    cp.on('exit', (code, signal) => console.log(`ng child process exited with code ${code} and signal ${signal}`));
  }
}
