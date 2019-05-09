import { EventEmitter } from "../../../../src/core/shared/event-emitter";
import { TestState } from "../../../../src/model/test-state.enum";
import { TestEvent } from "vscode-test-adapter-api";
import { KarmaEvent } from "../../../../src/model/karma-event";
import { TestResult } from "../../../../src/model/test-status.enum";

test("should emit correctly a test state event", () => {
  // Arrange
  const eventEmitterInterface = { fire() {} };
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
  const eventEmitterInterface = { fire() {} };
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
