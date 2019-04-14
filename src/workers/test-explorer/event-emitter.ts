import { KarmaEvent } from "./../../model/karma-event";
import { TestState } from "./../../model/test-state.enum";
import { TestEvent } from "vscode-test-adapter-api";
import { TestResultToTestStateMapper } from "./test-result-to-test-state.mapper";

export class EventEmitter {
  public constructor(private readonly eventEmitterInterface: any) {}

  public emitTestStateEvent(testName: string, testState: TestState) {
    const testEvent = { type: "test", test: testName, state: testState } as TestEvent;
    this.eventEmitterInterface.fire(testEvent);
  }

  public emitTestResultEvent(testName: string, karmaEvent: KarmaEvent) {
    const testResultMapper = new TestResultToTestStateMapper();
    const testState = testResultMapper.Map(karmaEvent.results.status);

    const testEvent = { type: "test", test: testName, state: testState } as TestEvent;

    if (karmaEvent.results.failureMessages.length > 0) {
      testEvent.message = karmaEvent.results.failureMessages[0];
    }

    this.eventEmitterInterface.fire(testEvent);
  }
}
