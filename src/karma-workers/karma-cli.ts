import * as karma from "karma";

export class KarmaCLI {
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new KarmaCLI();
    }
    return this.instance;
  }

  private static instance: KarmaCLI;

  private constructor() {}

  public async runServer(): Promise<void> {
    karma.runner.run({ port: 9876 }, (exitCode: number) => {
      global.console.log("karma run done with ", exitCode);
    });
  }

  public runServerWithConfig() {
    const http = require("http");

    const options = {
      hostname: "localhost",
      path: "http://localhost:9876/" + "run",
      port: 9876,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const request = http.request(options, (response: any) => {
      response.on("data", (buffer: any) => {
        global.console.log(buffer);
      });
    });

    request.on("error", (e: any) => {
      if (e.code === "ECONNREFUSED") {
        global.console.log("There is no server listening on port %d", options.port);
      } else {
        throw e;
      }
    });

    request.end(() => {
      global.console.log("request end");
    });
  }

  public stopServer(): void {
    karma.stopper.stop();
  }
}
