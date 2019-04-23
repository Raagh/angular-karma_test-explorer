import { Logger } from "./../test-explorer/logger";
import { SpawnOptions } from "child_process";
import spawn = require("cross-spawn");
import { KarmaEventListener } from "../karma/karma-event-listener";
import { window, OutputChannel } from "vscode";

export class AngularServer {
  private angularProcess: any;
  private readonly logger: Logger;
  private karmaEventListener: KarmaEventListener;

  public constructor(private angularProjectRootPath: string, private baseKarmaConfigFilePath: string, channel: OutputChannel) {
    this.logger = new Logger(channel);
    this.karmaEventListener = KarmaEventListener.getInstance(channel);
  }

  public stopPreviousRun(): Promise<void> {
    if (this.angularProcess != null) {
      this.karmaEventListener.stopListeningToKarma();
      this.angularProcess.kill();
    }

    return new Promise<void>(resolve => {
      this.angularProcess.on("exit", (code: any, signal: any) => {
        this.logger.info(`Angular exited with code ${code} and signal ${signal}`);
        resolve();
      });
    });
  }

  public start(): void {
    const baseKarmaConfigFilePath = require.resolve(this.baseKarmaConfigFilePath);
    const options = {
      cwd: this.angularProjectRootPath,
      shell: true,
    } as SpawnOptions;

    const { cliCommand, cliArgs } = this.createAngularCommandAndArguments(baseKarmaConfigFilePath);

    this.angularProcess = spawn(cliCommand, cliArgs, options);

    this.logger.info(`Starting Angular tests with arguments: ${cliArgs.join(" ")}`);

    this.angularProcess.stdout.on("data", (data: any) => {
      const { isTestRunning } = this.karmaEventListener;
      const regex = new RegExp(/\(.*?)\m/, "g");
      if (isTestRunning) {
        this.logger.karmaLogs(`${data.toString().replace(regex, "")}`);
      }
    });

    this.angularProcess.stderr.on("data", (data: any) => this.logger.error(`stderr: ${data}`));

    this.angularProcess.on("error", (err: any) => this.logger.error(`error from ng child process: ${err}`));
  }

  private createAngularCommandAndArguments(baseKarmaConfigFilePath: string) {
    const fs = require("fs");
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = fs.existsSync(path.join(this.angularProjectRootPath, "node_modules", "@angular", "cli", "bin", "ng"));

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
