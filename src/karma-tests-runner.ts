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
    karma.runner.run({ port: 9876 }, (exitCode: number) => {
      global.console.log("karma run done with ", exitCode);
    });
  }

  public stopServer(): void {
    karma.stopper.stop();
  }
}
