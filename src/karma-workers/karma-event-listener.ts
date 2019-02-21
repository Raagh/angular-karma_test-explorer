import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";
import { TestResult } from "../model/test-status.enum";
import { Helper } from "../helper";

export class KarmaEventListener {
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new KarmaEventListener();
    }
    return this.instance;
  }
  private static instance: KarmaEventListener;
  public isServerLoaded: boolean = false;
  private savedSpecs: any[] = [];
  private fakeTestSuiteName: string = "LoadTests";

  private constructor() {}

  public listenTillKarmaReady(eventEmitter: any): Promise<void> {
    return new Promise<void>(resolve => {
      const app = require("express")();
      const http = require("http").Server(app);
      const io = require("socket.io")(http);

      io.on("connection", (socket: any) => {
        socket.on("spec_complete", (testResult: any) => {
          global.console.log("spec_complete - result:" + testResult.status + " - " + "testname:" + testResult.suite + " " + testResult.description);

          if (testResult.suite[0] !== this.fakeTestSuiteName) {
            eventEmitter.fire({ type: "test", test: testResult.suite + " " + testResult.description, state: "running" });
            this.savedSpecs.push(testResult);

            if (testResult.status === TestResult.Failed) {
              eventEmitter.fire({ type: "test", test: testResult.suite + " " + testResult.description, state: "failed" });
            } else if (testResult.status === TestResult.Success) {
              eventEmitter.fire({ type: "test", test: testResult.suite + " " + testResult.description, state: "passed" });
            } else if (testResult.status === TestResult.Skipped) {
              eventEmitter.fire({ type: "test", test: testResult.suite + " " + testResult.description, state: "skipped" });
            }
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
          this.isServerLoaded = true;
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
    const suites = Helper.groupBy(savedSpecs, "suite");

    return {
      type: "suite",
      id: "root",
      label: "Angular",
      children: Object.keys(suites).map<TestSuiteInfo>(
        (key: any, index: any): TestSuiteInfo => {
          return {
            type: "suite",
            id: key,
            label: key,
            children: suites[key].map(
              (x: any): TestInfo => {
                return {
                  type: "test",
                  id: x.suite[0] + " " + x.description,
                  label: x.description,
                };
              }
            ),
          };
        }
      ),
    };
  }
}
