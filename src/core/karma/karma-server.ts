import { CommandlineProcessHandler } from "../integration/commandline-process-handler";
import { TestServer } from "../../model/test-server";
import { KarmaEventListener } from "../integration/karma-event-listener";
import { Logger } from "../shared/logger";
import { TestExplorerConfiguration } from "../../model/test-explorer-configuration";
import { KarmaProcessConfigurator } from "../karma/karma-process-configurator";

export class KarmaServer implements TestServer {
  public constructor(
    private readonly karmaEventListener: KarmaEventListener,
    private readonly logger: Logger,
    private readonly processHandler: CommandlineProcessHandler,
    private readonly processConfigurator: KarmaProcessConfigurator
  ) {}

  public async start(config: TestExplorerConfiguration): Promise<void> {
    const baseKarmaConfigFilePath = require.resolve(config.baseKarmaConfFilePath);

    const { command, processArguments } = this.processConfigurator.createProcessCommandAndArguments(baseKarmaConfigFilePath);
    const options = this.processConfigurator.createProcessOptions(
      config.projectRootPath,
      config.userKarmaConfFilePath,
      config.defaultSocketConnectionPort
    );

    this.processHandler.create(command, processArguments, options);

    await this.karmaEventListener.listenTillKarmaReady(config.defaultSocketConnectionPort);
  }

  public stop(): void {
    if (this.karmaEventListener.isServerLoaded) {
      const stopper = require("karma").stopper;
      stopper.stop({ port: 9876 }, (exitCode: number) => {
        this.logger.info(`Karma exited succesfully`);
      });
      this.karmaEventListener.stopListeningToKarma();
    }
  }

  public async stopAsync(): Promise<void> {
    return new Promise<void>(resolve => {
      if (this.karmaEventListener.isServerLoaded) {
        const stopper = require("karma").stopper;
        stopper.stop({ port: 9876 }, (exitCode: number) => {
          this.logger.info(`Karma exited succesfully`);
          resolve();
          this.karmaEventListener.stopListeningToKarma();
        });
      }
    });
  }
}
