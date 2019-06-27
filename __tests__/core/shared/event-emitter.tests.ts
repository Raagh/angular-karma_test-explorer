import { EventEmitter } from "../../../src/core/shared/event-emitter";
import { TestState } from "../../../src/model/enums/test-state.enum";
import { KarmaEvent } from "../../../src/model/karma-event";
import { TestResult } from "../../../src/model/enums/test-status.enum";
import { TestEvent, TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent } from "vscode-test-adapter-api";
import * as vscode from "vscode";

const failureMessages = [
  `Expected 'test-project' to equal 'test-projectsdsdsd'.\n
  at UserContext.<anonymous> (src/app/app.component.spec.ts:22:23)\n
  at ZoneDelegate../node_modules/zone.js/dist/zone.js.ZoneDelegate.invoke (node_modules/zone.js/dist/zone.js:391:1)\n
  at ProxyZoneSpec.push../node_modules/zone.js/dist/zone-testing.js.ProxyZoneSpec.onInvoke (node_modules/zone.js/dist/zone-testing.js:289:1)\n
  at ZoneDelegate../node_modules/zone.js/dist/zone.js.ZoneDelegate.invoke (node_modules/zone.js/dist/zone.js:390:1)`,
];

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
  const karmaEvent = new KarmaEvent("karmaEventName", { status: TestResult.Success, failureMessages });
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
      message: "Expected 'test-project' to equal 'test-projectsdsdsd'. (line:22 column:23)",
    } as TestEvent)
  );
});

test("should emit correctly a test result event with test decorations", () => {
  // Arrange
  const eventEmitterInterface = { fire() {}, event: {}, dispose() {} } as vscode.EventEmitter<
    TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent
  >;

  jest.spyOn(eventEmitterInterface, "fire");
  const testName = "testName";
  const karmaEvent = new KarmaEvent("karmaEventName", { status: TestResult.Success, failureMessages });
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
      message: "Expected 'test-project' to equal 'test-projectsdsdsd'. (line:22 column:23)",
      decorations: [{ line: 22, message: "Expected 'test-project' to equal 'test-projectsdsdsd'." }],
    } as TestEvent)
  );
});
