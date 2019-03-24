import { TestSuiteInfo } from "vscode-test-adapter-api";
import { SpecToTestSuiteMapper } from "../../workers/test-explorer/spec-to-test-suite.mapper";
import { KarmaEvent } from "../../model/karma-event";
import { KarmaEventName } from "../../model/karma-event-name.enum";
import { TestState } from "../../model/test-state.enum";
import { Logger } from '../test-explorer/logger';
import { EventEmitter } from '../test-explorer/event-emitter';

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
  private readonly specToTestSuiteMapper: SpecToTestSuiteMapper;
  private readonly logger: Logger;

  private constructor() {
    this.specToTestSuiteMapper = new SpecToTestSuiteMapper();
    this.logger = new Logger();
  }

  public listenTillKarmaReady(eventEmitter: EventEmitter): Promise<void> {
    return new Promise<void>(resolve => {
      const app = require("express")();
      this.server = require("http").createServer(app);
      const io = require("socket.io")(this.server, {'pingInterval': 10, 'pingTimeout': 240000});

      io.on("connection", (socket: any) => {
        socket.on(KarmaEventName.BrowserConnected, () => {
          this.onBrowserConnected(resolve);
        });
        socket.on(KarmaEventName.BrowserError, (event: KarmaEvent) => {
          this.logger.log("browser_error " + event.results);
        });
        socket.on(KarmaEventName.BrowserStart, () => {
          this.savedSpecs = [];
        });
        socket.on(KarmaEventName.RunComplete, (event: KarmaEvent) => {
          this.logger.log("run_complete " + event.results);
        });
        socket.on(KarmaEventName.SpecComplete, (event: KarmaEvent) => {
          this.onSpecComplete(event, eventEmitter);
        });

        socket.on("disconnect", (event:any) => {
          this.logger.log("AngularReporter closed connection with event: " + event);
        });
      });

      this.server.listen(1111, () => {
        this.logger.log("Listening to AngularReporter events on port 1111");
      });
    });
  }
  
  public getLoadedTests(): TestSuiteInfo {
    return this.specToTestSuiteMapper.map(this.savedSpecs);
  }

  public stopListeningToKarma() {
    this.server.close();
  }

  private onSpecComplete(event: KarmaEvent, eventEmitter: EventEmitter) {
    let testName = event.results.suite + " " + event.results.description;;
    if (event.results.suite.length > 1) {
      testName = event.results.suite.join(" ") + " " + event.results.description;
    }

    if (testName.includes(this.lastRunTests) || this.lastRunTests === "") {
      eventEmitter.emitTestStateEvent(testName, TestState.Running);
      this.savedSpecs.push(event.results);

      eventEmitter.emitTestResultEvent(testName, event);

      if (this.lastRunTests !== "") {
        this.logger.log("spec_complete - result:" + event.results.status + " - " + "testname:" + testName);
      }
    }
  }

  private onBrowserConnected(resolve: (value?: void | PromiseLike<void> | undefined) => void) {
    resolve();
    this.isServerLoaded = true;
  }
}
