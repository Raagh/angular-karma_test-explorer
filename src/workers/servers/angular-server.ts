import { Logger } from "./../test-explorer/logger";
import { SpawnOptions } from "child_process";
import { KarmaEventListener } from "../karma/karma-event-listener";
import { AngularProject } from "../../model/angular-project";
import { window } from "vscode";

export class AngularServer {
  private angularProcess: any;

  public constructor(private readonly karmaEventListener: KarmaEventListener, private readonly logger: Logger) {
  }

  public stop(): Promise<void> {
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

  public start(project: AngularProject, _baseKarmaConfigFilePath: string): void {
    const spawn = require("cross-spawn");
    const baseKarmaConfigFilePath = require.resolve(_baseKarmaConfigFilePath);
    const testExplorerEnvironment = Object.create(process.env);
    testExplorerEnvironment.userKarmaConfigPath = project.karmaConfPath;
    const options = {
      cwd: project.rootPath,
      shell: true,
      env: testExplorerEnvironment,
    } as SpawnOptions;

    const { cliCommand, cliArgs } = this.createAngularCommandAndArguments(project, baseKarmaConfigFilePath);

    this.angularProcess = spawn(cliCommand, cliArgs, options);

    this.logger.info(`Starting Angular test enviroment for project: ${project.name}`);

    this.angularProcess.stdout.on("data", (data: any) => {
      const { isTestRunning } = this.karmaEventListener;
      const regex = new RegExp(/\(.*?)\m/, "g");
      if (isTestRunning) {
        let log = data.toString().replace(regex, "");
        if (log.startsWith("e ")) {
          log = "HeadlessChrom" + log;
        }
        this.logger.karmaLogs(`${log}`);
      }
    });

    this.angularProcess.stderr.on("data", (data: any) => this.logger.error(`stderr: ${data}`));

    this.angularProcess.on("error", (err: any) => this.logger.error(`error from ng child process: ${err}`));
  }

  private createAngularCommandAndArguments(project: AngularProject, baseKarmaConfigFilePath: string) {
    const fs = require("fs");
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = fs.existsSync(path.join(project.rootPath, "node_modules", "@angular", "cli", "bin", "ng"));

    const commonArgs = ["test", project.name, `--karma-config="${baseKarmaConfigFilePath}"`, "--progress=false"];
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
      throw new Error(error);
    }

    return { cliCommand, cliArgs };
  }
}
