import { OutputChannel } from 'vscode';
import { KarmaEventListener } from './../../../../src/workers/karma/karma-event-listener';
import { KarmaRunner } from './../../../../src/workers/karma/karma-runner';
import { Logger } from '../../../../src/workers/test-explorer/logger';


jest.mock('./../../../../src/workers/karma/karma-event-listener');
jest.mock('../../../../src/workers/test-explorer/logger');

test("isKarmaRunning should return true if karma is running", () => {
    // Arrange
    const karmaRunner = new KarmaRunner()

    // Act

    // Assert
});