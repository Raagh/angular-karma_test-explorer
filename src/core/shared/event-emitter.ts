import { KarmaEvent } from "./../../model/karma-event";
import { TestState } from "../../model/enums/test-state.enum";
import {
  TestEvent,
  TestRunStartedEvent,
  TestRunFinishedEvent,
  TestSuiteEvent,
  TestDecoration,
  TestLoadStartedEvent,
  TestLoadFinishedEvent,
  TestSuiteInfo,
} from "vscode-test-adapter-api";
import { TestResultToTestStateMapper } from "../test-explorer/test-result-to-test-state.mapper";
import * as vscode from "vscode";
import { SpecCompleteResponse } from "../../model/spec-complete-response";

export class EventEmitter {
  public constructor(
    private readonly eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    private readonly testLoadedEmitterInterface: vscode.EventEmitter<TestLoadStartedEvent | TestLoadFinishedEvent>
  ) {}

  public emitTestStateEvent(testName: string, testState: TestState) {
    const testEvent = { type: "test", test: testName, state: testState } as TestEvent;
    this.eventEmitterInterface.fire(testEvent);
  }

  public emitTestResultEvent(testName: string, karmaEvent: KarmaEvent) {
    const testResultMapper = new TestResultToTestStateMapper();
    const testState = testResultMapper.Map(karmaEvent.results.status);

    const testEvent = { type: "test", test: testName, state: testState } as TestEvent;

    if (karmaEvent.results.failureMessages.length > 0) {
      testEvent.decorations = this.createDecorations(karmaEvent.results);
      testEvent.message = this.createErrorMessage(karmaEvent.results);
    }

    this.eventEmitterInterface.fire(testEvent);
  }

  public emitTestsLoadedEvent(loadedTests: TestSuiteInfo) {
    this.testLoadedEmitterInterface.fire({ type: "started" } as TestLoadStartedEvent);
    this.testLoadedEmitterInterface.fire({ type: "finished", suite: loadedTests } as TestLoadFinishedEvent);
  }

  private createErrorMessage(results: SpecCompleteResponse): string {
    const failureMessage = results.failureMessages[0];
    const message = failureMessage.split("\n")[0];

    if (!results.filePath) {
      return message;
    }

    try {
      const errorLineAndColumnCollection = failureMessage.substring(failureMessage.indexOf(results.filePath)).split(":");
      const lineNumber = parseInt(errorLineAndColumnCollection[1], undefined);
      const columnNumber = parseInt(errorLineAndColumnCollection[2], undefined);

      if (isNaN(lineNumber) || isNaN(columnNumber)) {
        return failureMessage;
      }

      return `${message} (line:${lineNumber} column:${columnNumber})`;
    } catch (error) {
      return failureMessage;
    }
  }

  private createDecorations(results: SpecCompleteResponse): TestDecoration[] | undefined {
    if (!results.filePath) {
      return undefined;
    }

    try {
      const decorations = results.failureMessages.map((failureMessage: string) => {
        const errorLineAndColumnCollection = failureMessage.substring(failureMessage.indexOf(results.filePath as string)).split(":");
        const lineNumber = parseInt(errorLineAndColumnCollection[1], undefined);
        return {
          line: lineNumber - 1,
          message: failureMessage.split("\n")[0],
        };
      });

      if (decorations.some((x) => isNaN(x.line))) {
        return undefined;
      }

      return decorations;
    } catch (error) {
      return undefined;
    }
  }
}
