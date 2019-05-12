import { TestResult } from "../../model/test-status.enum";
import { RunStatus } from "../../model/run-status.enum";
import { SpecCompleteResponse } from "../../model/spec-complete-response";
import { PathFinder } from "../shared/path-finder";
import { FileHelper } from "../integration/file-helper";
import * as io from "socket.io-client";
import * as karma from "karma";
import path = require("path");

function TestExplorerCustomReporter(this: any, baseReporterDecorator: any, config: any, logger: any, emitter: any, formatError: any) {
  this.config = config;
  this.emitter = emitter;
  this.socket = io("http://localhost:9999/", { forceNew: true });

  const BASE_PATH = "src/app/";
  const FILE_PATTERN = "**/*spec.ts";
  const ENCODING = "utf-8";

  global.console.log("reached this!");
  const pathFinder = new PathFinder(new FileHelper());

  const pattern = path.join(BASE_PATH, FILE_PATTERN);

  const paths = pathFinder.parseTestFiles(pattern, ENCODING);

  const emitEvent = (eventName: any, eventResults: any = null) => {
    this.socket.emit(eventName, { name: eventName, results: eventResults });
  };

  baseReporterDecorator(this);

  this.adapters = [];

  this.onSpecComplete = (browser: any, spec: any) => {
    let status: TestResult = TestResult.Failed;
    if (spec.skipped) {
      status = TestResult.Skipped;
    } else if (spec.success) {
      status = TestResult.Success;
    }

    const result = new SpecCompleteResponse(spec.log, spec.suite, spec.description, status, spec.time);

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

  this.specSkipped = (browser: any, result: any) => {
    var localPath = pathFinder.testFile(paths, result.suite[0], result.description);
    if (localPath !== undefined) {
      emitEvent("spec_skipped", localPath);
    }
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

function collectRunState(runResult: karma.TestResults): RunStatus {
  if (runResult.disconnected) {
    return RunStatus.Timeout;
  } else if (runResult.error) {
    return RunStatus.Error;
  } else {
    return RunStatus.Complete;
  }
}

TestExplorerCustomReporter.$inject = ["baseReporterDecorator", "config", "logger", "emitter", "formatError"];

export const instance = TestExplorerCustomReporter;
export const name = "AngularReporter";
