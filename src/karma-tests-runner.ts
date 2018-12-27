import * as karma from "karma";

export class KarmaTestsRunner {
  public static GetInstance() {
    if (this.instance == null) {
      this.instance = new KarmaTestsRunner();
    }
    return this.instance;
  }

  private static instance: KarmaTestsRunner;

  private constructor() {
    const Server = require("karma").Server;
    const createdServer = new Server({ port: 9876 }, (exitCode: number) => {
      global.console.log("karma run done with ", exitCode);
    });
    createdServer.start();
  }

  public async RunServer(): Promise<void> {
    karma.runner.run();
  }

  public StopServer(): void {
    karma.stopper.stop();
  }
}
