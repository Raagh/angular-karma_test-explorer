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

  public listenTillKarmaReady(eventEmitter: any, angularProcess: any): Promise<void> {
    return new Promise<void>(resolve => {
      angularProcess.on("message", (event: any) => {
        switch (event.name) {
          case "browser_connected":
            this.onBrowserConnected(resolve);
            break;
          case "run_complete":
            global.console.log("run_complete " + event.results);
            break;
          case "spec_complete":
            this.onSpecComplete(event, eventEmitter);
            break;
          case "browser_start":
            this.savedSpecs = [];
            break;
          case "browser_error":
            global.console.log("browser_error " + event.results);
            break;
        }
      });
    });
  }

  public getTests(): TestSuiteInfo {
    return this.createTestSuite(this.savedSpecs);
  }

  private onSpecComplete(event: any, eventEmitter: any) {
    global.console.log(
      "spec_complete - result:" + event.results.status + " - " + "testname:" + event.results.suite + " " + event.results.description
    );
    if (event.results.suite[0] !== this.fakeTestSuiteName) {
      eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: "running" });
      this.savedSpecs.push(event.results);
      if (event.results.status === TestResult.Failed) {
        eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: "failed" });
      } else if (event.results.status === TestResult.Success) {
        eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: "passed" });
      } else if (event.results.status === TestResult.Skipped) {
        eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: "skipped" });
      }
    }
  }

  private onBrowserConnected(resolve: (value?: void | PromiseLike<void> | undefined) => void) {
    resolve();
    this.isServerLoaded = true;
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
