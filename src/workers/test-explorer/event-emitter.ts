import { TestState } from './../../model/test-state.enum';
import { TestEvent } from 'vscode-test-adapter-api';
export class EventEmitter {
    public constructor(private readonly eventEmitterInterface: any) {}

    public emitTestStateEvent(testName: string, testState: TestState) {
        const testEvent = { type: "test", test: testName, state: testState } as TestEvent;
        this.eventEmitterInterface.fire(testEvent);
    }
}
