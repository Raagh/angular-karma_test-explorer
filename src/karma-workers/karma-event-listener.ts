import { TestSuiteInfo } from "vscode-test-adapter-api";

export class KarmaEventListener {
  public tests: TestSuiteInfo = {};
  public runCompleted: boolean = false;
  private savedSpecs: any[] = [];
  public startListening(): void {
    const app = require("express")();
    const http = require("http").Server(app);
    const io = require("socket.io")(http);
    this.runCompleted = false;

    io.on("connection", (socket: any) => {
      socket.on("spec_complete", (testResult: any) => {
        global.console.log("spec_complete - result:" + testResult.status + " - " + "testname:" + testResult.name);
        this.savedSpecs.push(testResult);
      });

      socket.on("run_complete", (runResult: any) => {
        global.console.log("run_complete " + runResult);
        this.runCompleted = true;
        this.tests = this.createTestSuite(this.savedSpecs);
      });

      socket.on("browser_start", () => {
        global.console.log("browser_start");
      });

      socket.on("browser_error", (error: any) => {
        global.console.log("browser_error " + error);
      });
    });

    http.listen(1111, () => {
      global.console.log("listening on port 1111");
    });
  }

  private createTestSuite(savedSpecs: any[]): TestSuiteInfo {
    return {
      type: "suite",
      id: "root",
      label: "Angular", // the label of the root node should be the name of the testing framework
      children: savedSpecs.map<TestSuiteInfo>((x: TestSuiteInfo) => {
        return {
          type: "test",
          id: "test3",
          label: "Test #3",
        };
      }),
    };
  }
}
