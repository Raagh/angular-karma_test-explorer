import { AngularRunner } from "./angular-runner";
import { KarmaTestsRunner } from "./karma-tests-runner";
import { AngularReporter } from "./angular-reporter";
import explorerKarmaConfig = require("./test-explorer-karma.conf");

export class TestExplorer {
  private readonly testRunner: KarmaTestsRunner;
  private readonly angularProjectRootPath: string = "/Users/pferraggi/Documents/GitHub/torneo-luefi.web";
  private readonly baseKarmaConfigPath: string = "/Users/pferraggi/Documents/GitHub/angular-test-explorer/out/test-explorer-karma.conf.js";

  public constructor() {
    explorerKarmaConfig.setGlobals({
      karmaConfig: { basePath: this.angularProjectRootPath },
    });
    this.testRunner = KarmaTestsRunner.getInstance();
    this.listenToServerStart();
    this.listenToBrowserReady();
    this.listenToError();
  }

  public async loadTests(): Promise<void> {
    const angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath, "");

    await angularRunner.start();

    await this.testRunner.runServer();

    

    // var http = require('http');

    // var options = {
    //   hostname: "localhost",
    //   path: "http://localhost:9876/" + 'run',
    //   port: 9876,
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // };
  
    // var request = http.request(options, function(response: any) {
    //   response.on('data', function(buffer: any) {
    //     global.console.log(this.stripExitCodeInfo(buffer));
    //   });
    // });
  
    // request.on('error', function(e: any) {
    //   if (e.code === 'ECONNREFUSED') {
    //     global.console.log('There is no server listening on port %d', options.port);
    //   } else {
    //     throw e;
    //   }
    // });

    // request.end(() => {
    //   global.console.log("request end");
    // });

  }

  public runTests(): void {
    throw new Error("Not Implemented");
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }

  private listenToServerStart() {
    AngularReporter.instance.on("server_start", (port: number) => {
      global.console.log("server_start on port " + port);
    });
    AngularReporter.instance.on("server_start", () => {
      global.console.log("server_start");
    });
  }

  private listenToBrowserReady() {
    AngularReporter.instance.on("browsers_ready", () => {
      global.console.log("browsers_ready");
    });
  }

  private listenToError() {
    AngularReporter.instance.on("browser_error", (error: string) => {
      global.console.log("browser_error");
    });
    AngularReporter.instance.on("compile_error", (errors: string[]) => {
      global.console.log("compile_error");
    });
  }

  private stripExitCodeInfo(buffer: any) {
    const EXIT_CODE_BUF = new Buffer('\x1FEXIT');

    if (!Buffer.isBuffer(buffer)) {
      return buffer;
    }
    var tailPos = buffer.length - EXIT_CODE_BUF.length - 2;
    if (tailPos < 0) {
      return buffer;
    }
    for (var i = 0; i < EXIT_CODE_BUF.length; i++) {
      if (buffer[tailPos + i] !== EXIT_CODE_BUF[i]) {
        return buffer;
      }
    }
    if (tailPos === 0) {
      return null;
    }
    return buffer.slice(0, tailPos);
  }
}
