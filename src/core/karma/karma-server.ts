import { TestServer } from "../../model/test-server";
import { KarmaEventListener } from "../integration/karma-event-listener";
import { Logger } from "../shared/logger";
import { TestExplorerConfiguration } from "../../model/test-explorer-configuration";
import { Server } from "karma";

export class KarmaServer implements TestServer {
  public constructor(private readonly karmaEventListener: KarmaEventListener, private readonly logger: Logger) {}

  public async start(config: TestExplorerConfiguration): Promise<void> {
    const server = new Server({
      configFile: require.resolve(config.baseKarmaConfFilePath),
    });

    await server.start();
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
