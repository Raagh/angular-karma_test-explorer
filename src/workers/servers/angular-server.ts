import { Logger } from "./../test-explorer/logger";
import { SpawnOptions } from "child_process";
import spawn = require("cross-spawn");
import { KarmaEventListener } from "../karma/karma-event-listener";
import { window } from 'vscode';

export class AngularServer {
  private readonly logger: Logger;
  private angularProcess: any;

  public constructor() {
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

  public start(angularProjectRootPath: string, _baseKarmaConfigFilePath: string, userKarmaConfPath:string ): void {
    const baseKarmaConfigFilePath = require.resolve(_baseKarmaConfigFilePath);
    const testExplorerEnvironment = Object.create( process.env );
    testExplorerEnvironment.userKarmaConfigPath = userKarmaConfPath;
    const options = {
      cwd: angularProjectRootPath,
      shell: true,
      env: testExplorerEnvironment
    } as SpawnOptions;

    const { cliCommand, cliArgs } = this.createAngularCommandAndArguments(angularProjectRootPath, baseKarmaConfigFilePath);

    this.angularProcess = spawn(cliCommand, cliArgs, options);

    this.logger.log(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    // this.angularProcess.stdout.on("data", (data: any) => this.logger.log(`stdout: ${data}`));
    this.angularProcess.stderr.on("data", (data: any) => this.logger.log(`stderr: ${data}`));
    this.angularProcess.on("error", (err: any) => this.logger.log(`error from ng child process: ${err}`));
  }

  private createAngularCommandAndArguments(angularProjectRootPath: string, baseKarmaConfigFilePath: string) {
    const fs = require("fs");
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = fs.existsSync(path.join(angularProjectRootPath, "node_modules", "@angular", "cli", "bin", "ng"));

    const commonArgs = ["test", `--karma-config="${baseKarmaConfigFilePath}"`, "--progress=false"];
    let cliCommand: string = "";
    let cliArgs: string[] = [];

    if (isAngularInstalledGlobally) {
      cliArgs = commonArgs;
      cliCommand = "ng";
    } else if (isAngularInstalledLocally) {
      cliArgs = ["ng", ...commonArgs];
      cliCommand = "npx";
    } else {
      const error = "@angular/cli is not installed, install it and restart vscode";
      window.showErrorMessage(error);
      throw Error(error);
    }

    return { cliCommand, cliArgs };
  }
}
