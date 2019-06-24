import { EventEmitter } from "../../../src/core/shared/event-emitter";
import { TestState } from "../../../src/model/enums/test-state.enum";
import { KarmaEvent } from "../../../src/model/karma-event";
import { TestResult } from "../../../src/model/enums/test-status.enum";
import { TestEvent, TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent } from "vscode-test-adapter-api";
import * as vscode from "vscode";

test("should emit correctly a test state event", () => {
  // Arrange
  const eventEmitterInterface = { fire() {}, event: {}, dispose() {} } as vscode.EventEmitter<
    TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent
  >;
  jest.spyOn(eventEmitterInterface, "fire");
  const testName = "testName";
  const testState = TestState.Passed;
  const eventEmitter = new EventEmitter(eventEmitterInterface);

  // Act
  eventEmitter.emitTestStateEvent(testName, testState);

  // Assert
  expect(eventEmitterInterface.fire).toBeCalledTimes(1);
  expect(eventEmitterInterface.fire).toBeCalledWith(
    expect.objectContaining({
      type: "test",
      test: testName,
      state: testState,
    } as TestEvent)
  );
});

test("should emit correctly a test result event", () => {
  // Arrange
  const eventEmitterInterface = { fire() {}, event: {}, dispose() {} } as vscode.EventEmitter<
    TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent
  >;
  jest.spyOn(eventEmitterInterface, "fire");
  const testName = "testName";
  const karmaEvent = new KarmaEvent("karmaEventName", { status: TestResult.Success, failureMessages: ["it failed"] });
  const eventEmitter = new EventEmitter(eventEmitterInterface);

  // Act
  eventEmitter.emitTestResultEvent(testName, karmaEvent);

  // Assert
  expect(eventEmitterInterface.fire).toBeCalledTimes(1);
  expect(eventEmitterInterface.fire).toBeCalledWith(
    expect.objectContaining({
      type: "test",
      test: testName,
      state: TestState.Passed,
      message: karmaEvent.results.failureMessages[0],
    } as TestEvent)
  );
});
