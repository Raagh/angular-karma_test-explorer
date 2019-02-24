import * as karma from "karma";
import { TestResult } from "../model/test-status.enum";
import { RunStatus } from "../model/run-status.enum";

function AngularReporter(this: any, baseReporterDecorator: any, config: any, logger: any, emitter: any, formatError: any) {
  this.config = config;
  this.emitter = emitter;

  const emitEvent = process.send
    ? (eventName: any, eventResults: any = null) => {
        process.send!({ name: eventName, results: eventResults });
      }
    : () => {};

  baseReporterDecorator(this);

  this.adapters = [];

  this.onSpecComplete = (browser: any, spec: any) => {
    let status: TestResult = TestResult.Failed;
    if (spec.skipped) {
      status = TestResult.Skipped;
    } else if (spec.success) {
      status = TestResult.Success;
    }

    const result: any = {
      failureMessages: spec.log,
      suite: spec.suite,
      description: spec.description,
      status,
      timeSpentMs: spec.time,
    };

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

function collectRunState(runResult: karma.TestResults): RunStatus {
  if (runResult.disconnected) {
    return RunStatus.Timeout;
  } else if (runResult.error) {
    return RunStatus.Error;
  } else {
    return RunStatus.Complete;
  }
}

AngularReporter.$inject = ["baseReporterDecorator", "config", "logger", "emitter", "formatError"];

export const instance = AngularReporter;
export const name = "AngularReporter";
