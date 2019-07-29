import { FileHelper } from "./file-helper";
import { TestResult } from "../../model/enums/test-status.enum";
import { RunStatus } from "../../model/enums/run-status.enum";
import { SpecCompleteResponse } from "../../model/spec-complete-response";
import { PathFinder } from "../shared/path-finder";
import * as io from "socket.io-client";
import * as karma from "karma";
import * as path from "path";

function TestExplorerCustomReporter(this: any, baseReporterDecorator: any, config: any, logger: any, emitter: any, injector: any) {
  this.config = config;
  this.emitter = emitter;
  const defaultSocketPort = process.env.defaultSocketPort as string;
  this.socket = io("http://localhost:" + defaultSocketPort + "/", { forceNew: true });
  this.socket.heartbeatTimeout = 24 * 60 * 60 * 1000;
  this.socket.heartbeatInterval = 24 * 60 * 60 * 1000;
  configureTimeouts(injector);

  const emitEvent = (eventName: any, eventResults: any = null) => {
    this.socket.emit(eventName, { name: eventName, results: eventResults });
  };

  const BASE_PATH = "src/app/";
  const FILE_PATTERN = "**/*spec.ts";
  const ENCODING = "utf-8";
  const pattern = path.join(BASE_PATH, FILE_PATTERN);

  const pathFinder = new PathFinder(new FileHelper());
  const paths = pathFinder.getTestFilesPaths(pattern, ENCODING);

  baseReporterDecorator(this);

  this.adapters = [];

  this.onSpecComplete = (browser: any, spec: any) => {
    let status: TestResult = TestResult.Failed;
    if (spec.skipped) {
      status = TestResult.Skipped;
      this.specSkipped(browser, spec);
    } else if (spec.success) {
      status = TestResult.Success;
    }

    let lineNumber = undefined;
    const filePath = pathFinder.getTestFilePath(paths, spec.suite[0], spec.description);

    if (filePath) {
      lineNumber = pathFinder.getSpecLine(spec.description, filePath, ENCODING);
    }

    const result = new SpecCompleteResponse(spec.log, spec.suite, spec.description, status, spec.time, filePath, lineNumber) as any;

    if (result.status === TestResult.Failed) {
      result.fullResponse = spec;
    }

    emitEvent("spec_complete", result);
  };

  this.onRunComplete = (browserCollection: any, result: any) => {
    emitEvent("run_complete", collectRunState(result));
  };

  this.onBrowserError = (browser: any, error: any) => {
    emitEvent("browser_error", error);
  };

  this.onBrowserStart = (browser: any, info: any) => {
    emitEvent("browser_start");
  };

  this.emitter.on("browsers_change", (capturedBrowsers: any) => {
    if (!capturedBrowsers.forEach) {
      // filter out events from Browser object
      return;
    }

    let proceed = true;
    capturedBrowsers.forEach((newBrowser: any) => {
      if (!newBrowser.id || !newBrowser.name || newBrowser.id === newBrowser.name) {
        proceed = false;
      }
    });
    if (proceed) {
      emitEvent("browser_connected");
    }
  });
}

function configureTimeouts(injector: any) {
  process.nextTick(() => {
    const webServer = injector.get("webServer");
    if (webServer) {
      // IDE posts http '/run' request to trigger tests (see karma-http-client.ts).
      // If a request executes more than `httpServer.timeout`, it will be timed out.
      // Disable timeout, as by default httpServer.timeout=120 seconds, not enough for suspended execution.
      webServer.timeout = 0;
    }
    const socketServer = injector.get("socketServer");
    if (socketServer) {
      // Disable socket.io heartbeat (ping) to avoid browser disconnecting when debugging tests,
      // because no ping requests are sent when test execution is suspended on a breakpoint.
      // Default values are not enough for suspended execution:
      //    'heartbeat timeout' (pingTimeout) = 60000 ms
      //    'heartbeat interval' (pingInterval) = 25000 ms
      socketServer.set("heartbeat timeout", 24 * 60 * 60 * 1000);
      socketServer.set("heartbeat interval", 24 * 60 * 60 * 1000);
    }
  });
}

function collectRunState(runResult: karma.TestResults): RunStatus {
  if (runResult.disconnected) {
    return RunStatus.Timeout;
  } else if (runResult.error) {
    return RunStatus.Error;
  } else {
    return RunStatus.Complete;
  }
}

TestExplorerCustomReporter.$inject = ["baseReporterDecorator", "config", "logger", "emitter", "injector"];

export const instance = TestExplorerCustomReporter;
export const name = "AngularReporter";
