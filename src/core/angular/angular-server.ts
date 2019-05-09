import { FileHelper } from "./../shared/file-helper";
import { AngularProcessHandler } from "../integration/angular-process-handler";
import { Logger } from "../shared/logger";
import { SpawnOptions } from "child_process";
import { KarmaEventListener } from "../integration/karma-event-listener";
import { AngularProject } from "../../model/angular-project";
import { window } from "vscode";
import { AngularProjectConfigLoader } from "./angular-project-config-loader";

export class AngularServer {
  public constructor(
    private readonly karmaEventListener: KarmaEventListener,
    private readonly logger: Logger,
    private readonly processHandler: AngularProcessHandler,
    private readonly fileHelper: FileHelper,
    private readonly angularProjectConfigLoader: AngularProjectConfigLoader
  ) {}

  public stop(): Promise<void> {
    if (this.karmaEventListener.isServerLoaded) {
      this.karmaEventListener.stopListeningToKarma();
      this.processHandler.kill();
    }

    return this.processHandler.onExitEvent();
  }

  public async start(defaultProjectName: string, _baseKarmaConfigFilePath: string, defaultSocketPort: number): Promise<void> {
    const project = this.angularProjectConfigLoader.load(defaultProjectName);
    const baseKarmaConfigFilePath = require.resolve(_baseKarmaConfigFilePath);
    const options = this.createProcessOptions(project);

    const { cliCommand, cliArgs } = this.createAngularCommandAndArguments(project, baseKarmaConfigFilePath);

    this.logger.info(`Starting Angular test enviroment for project: ${project.name}`);

    this.processHandler.create(cliCommand, cliArgs, options);

    await this.karmaEventListener.listenTillKarmaReady(defaultSocketPort);
  }

  private createProcessOptions(project: AngularProject) {
    const testExplorerEnvironment = Object.create(process.env);
    testExplorerEnvironment.userKarmaConfigPath = project.karmaConfPath;
    const options = {
      cwd: project.rootPath,
      shell: true,
      env: testExplorerEnvironment,
    } as SpawnOptions;
    return options;
  }

  private createAngularCommandAndArguments(project: AngularProject, baseKarmaConfigFilePath: string) {
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = this.fileHelper.doesFileExists(path.join(project.rootPath, "node_modules", "@angular", "cli", "bin", "ng"));

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
