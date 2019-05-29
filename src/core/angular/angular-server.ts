import { FileHelper } from "../integration/file-helper";
import { AngularProcessHandler } from "../integration/angular-process-handler";
import { Logger } from "../shared/logger";
import { SpawnOptions } from "child_process";
import { KarmaEventListener } from "../integration/karma-event-listener";
import { window } from "vscode";
import { AngularProjectConfigLoader } from "./angular-project-config-loader";
import { TestExplorerConfiguration } from "../../model/test-explorer-configuration";

export class AngularServer {
  public constructor(
    private readonly karmaEventListener: KarmaEventListener,
    private readonly logger: Logger,
    private readonly processHandler: AngularProcessHandler,
    private readonly fileHelper: FileHelper,
    private readonly angularProjectConfigLoader: AngularProjectConfigLoader
  ) {}

  public async stopAsync(): Promise<void> {
    if (this.karmaEventListener.isServerLoaded || this.processHandler.isProcessRunning()) {
      this.karmaEventListener.stopListeningToKarma();
      return await this.processHandler.killAsync();
    }
  }

  public stop(): void {
    if (this.karmaEventListener.isServerLoaded || this.processHandler.isProcessRunning()) {
      this.karmaEventListener.stopListeningToKarma();
      this.processHandler.kill();
    }
  }

  public async start(config: TestExplorerConfiguration): Promise<void> {
    const baseKarmaConfigFilePath = require.resolve(config.baseKarmaConfFilePath);

    const project = this.angularProjectConfigLoader.getDefaultAngularProjectConfig(config.angularProjectPath, config.defaultAngularProjectName);
    const options = this.createProcessOptions(project.rootPath, project.karmaConfPath, config.defaultSocketConnectionPort);
    const { cliCommand, cliArgs } = this.createAngularCommandAndArguments(project.name, baseKarmaConfigFilePath, config.angularProjectPath);

    this.logger.info(`Starting Angular test enviroment for project: ${project.name}`);

    this.processHandler.create(cliCommand, cliArgs, options);

    await this.karmaEventListener.listenTillKarmaReady(config.defaultSocketConnectionPort);
  }

  private createProcessOptions(projectRootPath: string, userKarmaConfigPath: string, defaultSocketPort: number) {
    const testExplorerEnvironment = Object.create(process.env);
    testExplorerEnvironment.userKarmaConfigPath = userKarmaConfigPath;
    testExplorerEnvironment.defaultSocketPort = defaultSocketPort;
    const options = {
      cwd: projectRootPath,
      shell: true,
      env: testExplorerEnvironment,
    } as SpawnOptions;
    return options;
  }

  private createAngularCommandAndArguments(projectName: string, baseKarmaConfigFilePath: string, workspaceRootPath: string) {
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = this.fileHelper.doesFileExists(path.join(workspaceRootPath, "node_modules", "@angular", "cli", "bin", "ng"));

    const commonArgs = ["test", projectName, `--karma-config="${baseKarmaConfigFilePath}"`, "--progress=false"];
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
