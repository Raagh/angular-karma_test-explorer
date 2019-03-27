import { Logger } from "./../test-explorer/logger";
import { SpawnOptions } from "child_process";
import spawn = require("cross-spawn");
import { KarmaEventListener } from "../karma/karma-event-listener";

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

  public start(): void {
    const fs = require("fs");
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = fs.existsSync(path.join(this.angularProjectRootPath, "node_modules", "@angular", "cli", "bin", "ng"));
    const options = {
      cwd: this.angularProjectRootPath,
      shell: true,
    } as SpawnOptions;

    let cliArgs: string[] = [];

    if (isAngularInstalledGlobally) {
      cliArgs = ["test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];
      this.angularProcess = spawn("ng", cliArgs, options);
    } else if (isAngularInstalledLocally) {
      cliArgs = ["ng", "test", `--karma-config="${require.resolve(this.baseKarmaConfigFilePath)}"`];
      this.angularProcess = spawn("npx", cliArgs, options);
    } else {
      throw Error("@angular/cli is not installed");
    }

    this.logger.log(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    // this.angularProcess.stdout.on('data', (data: any) => this.logger.log(`stdout: ${data}`));
    // this.angularProcess.stderr.on("data", (data: any) => this.logger.log(`stderr: ${data}`));
    // this.angularProcess.on("error", (err: any) => this.logger.log(`error from ng child process: ${err}`));
  }
}
