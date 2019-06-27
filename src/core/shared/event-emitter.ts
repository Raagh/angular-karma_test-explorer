import { KarmaEvent } from "./../../model/karma-event";
import { TestState } from "../../model/enums/test-state.enum";
import { TestEvent, TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestDecoration } from "vscode-test-adapter-api";
import { TestResultToTestStateMapper } from "../test-explorer/test-result-to-test-state.mapper";
import * as vscode from "vscode";
import { SpecCompleteResponse } from "../../model/spec-complete-response";

export class EventEmitter {
  public constructor(
    private readonly eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
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

  private createErrorMessage(results: SpecCompleteResponse): string {
    const failureMessage = results.failureMessages[0];

    try {
      const lineNumber = parseInt(failureMessage.split(":")[1], undefined);
      const columnNumber = parseInt(failureMessage.split(":")[2], undefined);
      const message = failureMessage.split("\n")[0];

      return `${message} (line:${lineNumber} column:${columnNumber})`;
    } catch (error) {
      return failureMessage;
    }
  }

  private createDecorations(results: SpecCompleteResponse): TestDecoration[] | undefined {
    try {
      return results.failureMessages.map((failureMessage: string) => {
        return {
          line: parseInt(failureMessage.split(":")[1], undefined),
          message: failureMessage.split("\n")[0],
        };
      });
    } catch (error) {
      return undefined;
    }
  }
}
