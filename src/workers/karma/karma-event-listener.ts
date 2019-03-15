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
  public lastRunTests: string = "";
  private savedSpecs: any[] = [];
  private server: any;
  private readonly fakeTestSuiteName: string = "LoadTests";
  private readonly specToTestSuiteMapper: SpecToTestSuiteMapper;

  private constructor() {
    this.specToTestSuiteMapper = new SpecToTestSuiteMapper();
  }

  public listenTillKarmaReady(eventEmitter: any): Promise<void> {
    return new Promise<void>(resolve => {
      const app = require("express")();
      this.server = require("http").createServer(app);
      const io = require("socket.io")(this.server, {'pingInterval': 10, 'pingTimeout': 240000});

      io.on("connection", (socket: any) => {
        socket.on(KarmaEventName.BrowserConnected, () => {
          this.onBrowserConnected(resolve);
        });
        socket.on(KarmaEventName.BrowserError, (event: KarmaEvent) => {
          global.console.log("browser_error " + event.results);
        });
        socket.on(KarmaEventName.BrowserStart, () => {
          this.savedSpecs = [];
        });
        socket.on(KarmaEventName.RunComplete, (event: KarmaEvent) => {
          global.console.log("run_complete " + event.results);
        });
        socket.on(KarmaEventName.SpecComplete, (event: KarmaEvent) => {
          this.onSpecComplete(event, eventEmitter);
        });

        socket.on("disconnect", (event:any) => {
          global.console.log("AngularReporter closed connection with event: " + event);
        });
      });

      this.server.listen(1111, () => {
        global.console.log("Listening to AngularReporter events on port 1111");
      });
    });
  }
  
  public getLoadedTests(): TestSuiteInfo {
    return this.specToTestSuiteMapper.map(this.savedSpecs);
  }

  public stopListeningToKarma() {
    this.server.close();
  }

  private onSpecComplete(event: KarmaEvent, eventEmitter: any) {
    const testName = event.results.suite + " " + event.results.description;
    global.console.log("spec_complete - result:" + event.results.status + " - " + "testname:" + testName);
    if (testName.includes(this.lastRunTests) || this.lastRunTests === "") {
      if (event.results.suite[0] !== this.fakeTestSuiteName) {
        eventEmitter.fire({ type: "test", test: testName, state: TestState.Running });
        this.savedSpecs.push(event.results);
        if (event.results.status === TestResult.Failed) {
          eventEmitter.fire({ type: "test", test: testName, state: TestState.Failed });
        } else if (event.results.status === TestResult.Success) {
          eventEmitter.fire({ type: "test", test: testName, state: TestState.Passed });
        } else if (event.results.status === TestResult.Skipped) {
          eventEmitter.fire({ type: "test", test: testName, state: TestState.Skipped });
        }
      }
    }
  }

  private onBrowserConnected(resolve: (value?: void | PromiseLike<void> | undefined) => void) {
    resolve();
    this.isServerLoaded = true;
  }
}
