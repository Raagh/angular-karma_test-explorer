import { Logger } from "./../test-explorer/logger";
import { SpawnOptions } from "child_process";
import spawn = require("cross-spawn");
import { KarmaEventListener } from "../karma/karma-event-listener";
import path = require("path");

export class AngularServer {
  private readonly logger: Logger;
  private angularProcess: any;

  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string) {
    this.logger = new Logger();
  }

  public stopPreviousRun(): Promise<void> {
    if (this.angularProcess != null) {
      this.angularProcess.kill();
    }

    return new Promise<void>(resolve => {
      this.angularProcess.on("exit", (code: any, signal: any) => {
        this.logger.log(`Angular exited with code ${code} and signal ${signal}`);
        const karmaEventListener = KarmaEventListener.getInstance();
        karmaEventListener.stopListeningToKarma();
        resolve();
      });
    });
  }

  public start(): boolean {
    const fs = require("fs");
    const isAngularProject = fs.existsSync(path.join(this.angularProjectRootPath, "angular.json"));

    if (!isAngularProject) {
      return false;
    }

    this.runNgTest();
    return true;
  }

  private runNgTest(): void {
    const cliArgs = ["test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];
    const angularCliPath = path.join(".", "node_modules", "@angular", "cli", "bin", "ng");
    this.logger.log(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    const options = {
      cwd: this.angularProjectRootPath,
      shell: true,
    } as SpawnOptions;

    this.angularProcess = spawn(angularCliPath, cliArgs, options);

    // this.angularProcess.stdout.on('data', (data: any) => this.logger.log(`stdout: ${data}`));
    // this.angularProcess.stderr.on("data", (data: any) => this.logger.log(`stderr: ${data}`));
    // this.angularProcess.on("error", (err: any) => this.logger.log(`error from ng child process: ${err}`));
  }
}
