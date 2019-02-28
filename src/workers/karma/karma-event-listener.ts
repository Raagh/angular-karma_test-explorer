import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestResult } from "../../model/test-status.enum";
import { SpecToTestSuiteMapper } from "../../workers/test-explorer/spec-to-test-suite.mapper";
import { KarmaEvent } from "../../model/karma-event";
import { KarmaEventName } from "../../model/karma-event-name.enum";
import { TestState } from "../../model/test-state.enum";

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
  private readonly fakeTestSuiteName: string = "LoadTests";
  private readonly specToTestSuiteMapper: SpecToTestSuiteMapper;

  private constructor() {
    this.specToTestSuiteMapper = new SpecToTestSuiteMapper();
  }

  public listenTillKarmaReady(eventEmitter: any, angularProcess: any): Promise<void> {
    return new Promise<void>(resolve => {
      angularProcess.on("message", (event: KarmaEvent) => {
        switch (event.name) {
          case KarmaEventName.BrowserConnected:
            this.onBrowserConnected(resolve);
            break;
          case KarmaEventName.RunComplete:
            global.console.log("run_complete " + event.results);
            break;
          case KarmaEventName.SpecComplete:
            this.onSpecComplete(event, eventEmitter);
            break;
          case KarmaEventName.BrowserStart:
            this.savedSpecs = [];
            break;
          case KarmaEventName.BrowserError:
            global.console.log("browser_error " + event.results);
            break;
        }
      });
    });
  }

  public getLoadedTests(): TestSuiteInfo {
    return this.specToTestSuiteMapper.map(this.savedSpecs);
  }

  private onSpecComplete(event: KarmaEvent, eventEmitter: any) {
    global.console.log(
      "spec_complete - result:" + event.results.status + " - " + "testname:" + event.results.suite + " " + event.results.description
    );
    if (event.results.suite[0] !== this.fakeTestSuiteName) {
      eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: TestState.Running });
      this.savedSpecs.push(event.results);
      if (event.results.status === TestResult.Failed) {
        eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: TestState.Failed });
      } else if (event.results.status === TestResult.Success) {
        eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: TestState.Passed });
      } else if (event.results.status === TestResult.Skipped) {
        eventEmitter.fire({ type: "test", test: event.results.suite + " " + event.results.description, state: TestState.Skipped });
      }
    }
  }

  private onBrowserConnected(resolve: (value?: void | PromiseLike<void> | undefined) => void) {
    resolve();
    this.isServerLoaded = true;
  }
}
