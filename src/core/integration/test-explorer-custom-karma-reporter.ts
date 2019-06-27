import { FileHelper } from "./file-helper";
import { TestResult } from "../../model/enums/test-status.enum";
import { RunStatus } from "../../model/enums/run-status.enum";
import { SpecCompleteResponse } from "../../model/spec-complete-response";
import { PathFinder } from "../shared/path-finder";
import * as io from "socket.io-client";
import * as karma from "karma";
import * as path from "path";

function TestExplorerCustomReporter(this: any, baseReporterDecorator: any, config: any, logger: any, emitter: any, formatError: any) {
  this.config = config;
  this.emitter = emitter;
  const defaultSocketPort = process.env.defaultSocketPort as string;
  this.socket = io("http://localhost:" + defaultSocketPort + "/", { forceNew: true });

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

    const filePath = pathFinder.getTestFilePath(paths, spec.suite[0], spec.description);
    const result = new SpecCompleteResponse(spec.log, spec.suite, spec.description, status, spec.time, filePath) as any;

    if (result.status === TestResult.Failed) {
      // const assertionObject = parseFailures(spec, result.description, formatError);
      result.assertionObject = spec;
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

function collectRunState(runResult: karma.TestResults): RunStatus {
  if (runResult.disconnected) {
    return RunStatus.Timeout;
  } else if (runResult.error) {
    return RunStatus.Error;
  } else {
    return RunStatus.Complete;
  }
}

// function parseFailures(result: any, specName: string, formatError: any) {
//   let stack = "";
//   result.log.forEach((log: any) => {
//     stack += formatError(log, "\t");
//   });
//   if (stack.length === 0 && result.pending) {
//     stack = "Pending test '" + specName + "'";
//   }
//   const firstAssertionError = Array.isArray(result.assertionErrors) ? result.assertionErrors[0] : null;
//   return normalizeAssertionError(stack, firstAssertionError);
// }

// function normalizeAssertionError(stack: any, assertionError: any) {
//   if (!assertionError) {
//     return { stack };
//   }
//   stack = stack || "";
//   let assertionMessage = assertionError.message;
//   const assertionName = assertionError.name;
//   const stackLeftTrimmed = stack.trimLeft();
//   if (isString(assertionMessage) && stackLeftTrimmed.indexOf(assertionMessage) === 0) {
//     stack = stackLeftTrimmed.substring(assertionMessage.length);
//   }
//   if (isString(assertionName) && isString(assertionMessage)) {
//     const compoundMessage = assertionName + ": " + assertionMessage;
//     if (stackLeftTrimmed.indexOf(compoundMessage) === 0) {
//       assertionMessage = compoundMessage;
//       stack = stackLeftTrimmed.substring(compoundMessage.length);
//     }
//   }
//   if (stack.length > 0 && stack.charAt(0) === "\n") {
//     stack = stack.substring(1);
//   }
//   return {
//     message: assertionMessage,
//     stack,
//     expected: assertionError.expected,
//     actual: assertionError.actual,
//   };
// }

// function isString(variable: any) {
//   return typeof variable === "string";
// }

TestExplorerCustomReporter.$inject = ["baseReporterDecorator", "config", "logger", "emitter", "formatError"];

export const instance = TestExplorerCustomReporter;
export const name = "AngularReporter";
