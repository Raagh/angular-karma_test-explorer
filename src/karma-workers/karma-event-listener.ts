import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";
import { TestResult } from "../model/test-status.enum";
export class KarmaEventListener {
  public nextRunIsForLoading: boolean = false;
  private savedSpecs: any[] = [];

  public listenTillKarmaReady(): Promise<void> {
    return new Promise<void>(resolve => {
      const app = require("express")();
      const http = require("http").Server(app);
      const io = require("socket.io")(http);

      io.on("connection", (socket: any) => {
        socket.on("spec_complete", (testResult: any) => {
          global.console.log("spec_complete - result:" + testResult.status + " - " + "testname:" + testResult.name);
          if (this.nextRunIsForLoading && testResult.status === TestResult.Skipped) {
            this.savedSpecs.push(testResult);
          } else if (!this.nextRunIsForLoading) {
            this.savedSpecs.push(testResult);
          }
        });

        socket.on("run_complete", (runResult: any) => {
          global.console.log("run_complete " + runResult);
        });

        socket.on("browser_start", () => {
          this.savedSpecs = [];
        });

        socket.on("browser_error", (error: any) => {
          global.console.log("browser_error " + error);
        });

        socket.on("browser_connected", () => {
          resolve();
        });
      });

      http.listen(1111, () => {
        global.console.log("listening to AngularReporter events on port 1111");
      });
    });
  }

  public getTests(): TestSuiteInfo {
    return this.createTestSuite(this.savedSpecs);
  }

  private createTestSuite(savedSpecs: any[]): TestSuiteInfo {
    return {
      type: "suite",
      id: "root",
      label: "Angular",
      children: savedSpecs.map<TestInfo>(
        (testInfo: any): TestInfo => {
          return {
            type: "test",
            id: testInfo.name,
            label: testInfo.name,
          };
        }
      ),
    };
  }
}
