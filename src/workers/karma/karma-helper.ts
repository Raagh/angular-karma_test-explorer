export class KarmaHelper {
  public constructor() {}

  public isValidKarmaConfig(karmaConfigFilePath: string): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(karmaConfigFilePath);

    global.console.log(karmaConfig);

    return karmaConfig != null || karmaConfig !== undefined;
  }

  public parseExitCode(buffer: any, defaultExitCode: any, failOnEmptyTestSuite: any) {
    const EXIT_CODE = Buffer.from("\x1FEXIT");
    const tailPos = buffer.length - Buffer.byteLength(EXIT_CODE) - 2;

    if (tailPos < 0) {
      return { exitCode: defaultExitCode, buffer };
    }

    const tail = buffer.slice(tailPos);
    const tailStr = tail.toString();
    if (tailStr.substr(0, tailStr.length - 2) === EXIT_CODE) {
      const emptyInt = parseInt(tailStr.substr(-2, 1), 10);
      let exitCode = parseInt(tailStr.substr(-1), 10);
      if (failOnEmptyTestSuite === false && emptyInt === 0) {
        global.console.log("Test suite was empty.");
        exitCode = 0;
      }
      return { exitCode, buffer: buffer.slice(0, tailPos) };
    }

    return { exitCode: defaultExitCode, buffer };
  }
}
