import * as karma from "karma";
import * as io from "socket.io-client";
import { TestResult } from "../model/test-status.enum";
import { RunStatus } from "../model/run-status.enum";

function AngularReporter(this: any, baseReporterDecorator: any, config: any, logger: any, helper: any, formatError: any) {
  this.config = config;

  baseReporterDecorator(this);

  this.socket = io("http://localhost:1111/");

  this.adapters = [];

  this.onSpecComplete = (browser: any, spec: any) => {
    const name = spec.suite.reduce((name: any, suite: any) => name + suite + " ", "") + spec.description;
    let status: TestResult = TestResult.Failed;
    if (spec.skipped) {
      status = TestResult.Skipped;
    } else if (spec.success) {
      status = TestResult.Success;
    }

    const result: any = {
      failureMessages: spec.log,
      name,
      status,
      timeSpentMs: spec.time,
    };
    this.socket.emit("spec_complete", result);
  };

  this.onRunComplete = (browserCollection: any, result: any) => {
    this.socket.emit("run_complete", collectRunState(result));
  };

  this.onBrowserError = (browser: any, error: any) => {
    this.socket.emit("browser_error", error);
  };

  this.onBrowserStart = (browser: any, info: any) => {
    this.socket.emit("browser_start");
  };
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

AngularReporter.$inject = ["baseReporterDecorator", "config", "logger", "helper", "formatError"];

module.exports = {
  instance: AngularReporter,
  name: "AngularReporter",
};
