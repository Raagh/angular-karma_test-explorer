import { TestSuiteInfo } from "vscode-test-adapter-api";
import { SpecToTestSuiteMapper } from "../../workers/test-explorer/spec-to-test-suite.mapper";
import { KarmaEvent } from "../../model/karma-event";
import { KarmaEventName } from "../../model/karma-event-name.enum";
import { TestState } from "../../model/test-state.enum";
import { Logger } from "../test-explorer/logger";
import { EventEmitter } from "../test-explorer/event-emitter";
import { commands } from "vscode";

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
  private karmaBeingReloaded: boolean = false;
  private readonly specToTestSuiteMapper: SpecToTestSuiteMapper;
  private readonly logger: Logger;

  private constructor() {
    this.specToTestSuiteMapper = new SpecToTestSuiteMapper();
    this.logger = new Logger();
  }

  public listenTillKarmaReady(eventEmitter: EventEmitter): Promise<void> {
    return new Promise<void>(resolve => {
      this.karmaBeingReloaded = false;
      const app = require("express")();
      this.server = require("http").createServer(app);
      const io = require("socket.io")(this.server, { pingInterval: 10, pingTimeout: 240000, forceNew: true });
      const port = 9999;

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

        socket.on("disconnect", (event: any) => {
          this.logger.log("AngularReporter closed connection with event: " + event);

          // workaround: if the connection is closed by chrome, we just reload the test enviroment
          // TODO: fix chrome closing all socket connections.
          if (event === "transport close" && !this.karmaBeingReloaded) {
            commands.executeCommand("test-explorer.reload");
          }
        });
      });

      this.server.listen(port, () => {
        this.logger.log("Listening to AngularReporter events on port " + port);
      });
    });
  }

  public getLoadedTests(): TestSuiteInfo[] {
    return this.specToTestSuiteMapper.map(this.savedSpecs);
  }

  public stopListeningToKarma() {
    this.karmaBeingReloaded = true;
    this.server.close();
  }

  private onSpecComplete(event: KarmaEvent, eventEmitter: EventEmitter) {
    let testName = event.results.suite + " " + event.results.description;
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
