import { CommandlineProcessHandler } from "../integration/commandline-process-handler";
import { Logger } from "../shared/logger";
import { KarmaEventListener } from "../integration/karma-event-listener";
import { AngularProjectConfigLoader } from "./angular-project-config-loader";
import { TestExplorerConfiguration } from "../../model/test-explorer-configuration";
import { AngularProcessConfigurator } from "../../../src/core/angular/angular-process-configurator";
import { TestServer } from "../../model/test-server";

export class AngularServer implements TestServer {
  public constructor(
    private readonly karmaEventListener: KarmaEventListener,
    private readonly logger: Logger,
    private readonly processHandler: CommandlineProcessHandler,
    private readonly angularProjectConfigLoader: AngularProjectConfigLoader,
    private readonly angularProcessConfigurator: AngularProcessConfigurator
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

    const project = this.angularProjectConfigLoader.getDefaultAngularProjectConfig(config.projectRootPath, config.defaultAngularProjectName);
    const options = this.angularProcessConfigurator.createProcessOptions(project.rootPath, project.karmaConfPath, config.defaultSocketConnectionPort);
    const { cliCommand, cliArgs } = this.angularProcessConfigurator.createProcessCommandAndArguments(
      project.name,
      baseKarmaConfigFilePath,
      config.projectRootPath
    );

    this.logger.info(`Starting Angular test enviroment for project: ${project.name}`);

    this.processHandler.create(cliCommand, cliArgs, options);

    await this.karmaEventListener.listenTillKarmaReady(config.defaultSocketConnectionPort);
  }
}
