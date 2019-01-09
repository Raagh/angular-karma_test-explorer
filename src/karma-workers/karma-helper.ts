import * as karma from "karma";

export class KarmaHelper {
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new KarmaHelper();
    }
    return this.instance;
  }

  private static instance: KarmaHelper;

  private constructor() {}

  public async runServer(): Promise<void> {
    karma.runner.run({ port: 9876 }, (exitCode: number) => {
      global.console.log("karma run done with ", exitCode);
    });
  }

  public stopServer(): void {
    karma.stopper.stop();
  }

  public isValidKarmaConfig(karmaConfigFilePath: string): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(karmaConfigFilePath);

    return karmaConfig != null || karmaConfig !== undefined;
  }

  public async isKarmaReady(): Promise<boolean> {
    // let isServerReady = false;
    // while (!isServerReady) {
    //   const request = require("request-promise");

    //   const options = {
    //     method: "GET",
    //     uri: "http://localhost:9876/",
    //     json: true,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   };

    //   try {
    //     const result = await request(options);
    //     if (result != null) {
    //       isServerReady = true;
    //     }
    //   } catch (e) {
    //     global.console.log(e);
    //   }
    // }

    // return isServerReady;

    return true;
  }
}
