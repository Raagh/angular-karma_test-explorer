import * as karma from "karma";

export class KarmaTestsRunner {
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new KarmaTestsRunner();
    }
    return this.instance;
  }

  private static instance: KarmaTestsRunner;

  private constructor() {}

  public async runServer(): Promise<void> {
    const Server = require('karma').Server
    const karmaConfig = {port: 9876}
    const server = new Server(karmaConfig, function(exitCode) {
      global.console.log('Karma has exited with ' + exitCode)
      process.exit(exitCode)
    })

    karma.runner.run({ port: 9876 }, (exitCode: number) => {
      global.console.log("karma run done with ", exitCode);
    });

    server.on('run_complete', (browsers:any, results:any) => {
      global.console.log(results);
    });
  }

  public stopServer(): void {
    karma.stopper.stop();
  }
}
