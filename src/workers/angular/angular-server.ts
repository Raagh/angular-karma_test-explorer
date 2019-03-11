import { FileHelper } from "./../test-explorer/file-helper";
import { KarmaHelper } from "../karma/karma-helper";
import explorerKarmaConfig = require("../../config/test-explorer-karma.conf");
import path = require("path");
import { SpawnOptions } from "child_process";
import spawn = require("cross-spawn");

export class AngularServer {
  private readonly karmaHelper: KarmaHelper;
  private readonly localPath: string;
  private readonly remotePath: string;
  private readonly angularProjectRootPath: string;
  private readonly fileHelper: FileHelper;
  private angularProcess: any;

  public constructor(angularProjectRootPath: string, private baseKarmaConfigFilePath: string) {
    this.angularProjectRootPath = angularProjectRootPath;
    explorerKarmaConfig.setGlobals({
      karmaConfigFile: this.angularProjectRootPath,
    });
    this.karmaHelper = new KarmaHelper();
    this.localPath = path.join(__dirname, "..", "..", "..", "src", "workers", "karma", "fakeTest.spec.ts");
    this.remotePath = path.join(this.angularProjectRootPath, "src", "app", "fakeTest.spec.ts");
    this.fileHelper = new FileHelper();
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
    return true;
  }

  public setup(): void {
    this.fileHelper.copyFile(this.localPath, this.remotePath);
  }

  public cleanUp(): void {
    this.fileHelper.deleteFile(this.remotePath);
    this.fileHelper.copyFile(this.localPath, this.remotePath);
    this.fileHelper.deleteFile(this.remotePath);
  }

  private runNgTest(): void {
    const cliArgs = ["test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];
    global.console.log(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    const options = {
      cwd: this.angularProjectRootPath,
      shell: true,
    } as SpawnOptions;

    this.angularProcess = spawn("ng", cliArgs, options);

    // this.angularProcess.stdout.on('data', (data: any) => global.console.log(`stdout: ${data}`));
    // this.angularProcess.stderr.on('data', (data: any) => global.console.log(`stderr: ${data}`));
    // this.angularProcess.on("error", (err: any) => global.console.log(`error from ng child process: ${err}`));
  }
}
