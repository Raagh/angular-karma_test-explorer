export class KarmaHttpClient {
  public constructor() {}
  public createKarmaRunCallConfiguration(tests: any) {
    // if testName is undefined, reset jasmine.getEnv().specFilter function
    // otherwise, last specified specFilter will be used
    if (tests[0] === "root" || tests[0] === undefined) {
      tests = "";
    }
    const serverPort = 9876;
    const urlRoot = "/run";
    const config = {
      port: serverPort,
      refresh: true,
      urlRoot,
      hostname: "localhost",
      clientArgs: [] as string[],
    };
    config.clientArgs = [`--grep=${tests}`];
    return { config, tests };
  }

  public callKarmaRunWithConfig(config: any): Promise<void> {
    return new Promise<void>(resolve => {
      const options = {
        hostname: config.hostname,
        path: config.urlRoot,
        port: config.port,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const http = require("http");

      const request = http.request(options);

      request.on("error", (e: any) => {
        if (e.code === "ECONNREFUSED") {
          global.console.error("There is no server listening on port %d", options.port);
        }
      });

      request.end(
        JSON.stringify({
          args: config.clientArgs,
          removedFiles: config.removedFiles,
          changedFiles: config.changedFiles,
          addedFiles: config.addedFiles,
          refresh: config.refresh,
        })
      );

      request.on("close", () => {
        resolve();
      });
    });
  }
}
