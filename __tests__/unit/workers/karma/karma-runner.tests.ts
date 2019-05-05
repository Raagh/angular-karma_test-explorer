import { KarmaEventListener } from "./../../../../src/workers/karma/karma-event-listener";
import { KarmaRunner } from "./../../../../src/workers/karma/karma-runner";
import { Logger } from "../../../../src/workers/test-explorer/logger";

jest.mock("./../../../../src/workers/karma/karma-event-listener");
jest.mock("../../../../src/workers/test-explorer/logger");

describe("isKarmaRunning", () => {
  test("should return true if karma is running", () => {
    // Arrange
    const loggerMockedClass = <jest.Mock<Logger>>Logger;
    const karmaEventListener: jest.Mocked<KarmaEventListener> = new (KarmaEventListener as any)() as any;
    karmaEventListener.isServerLoaded = true;
    const karmaRunner = new KarmaRunner(karmaEventListener, new loggerMockedClass());

    // Act
    karmaRunner.isKarmaRunning();

    // Assert
    expect(karmaEventListener.isServerLoaded).toBeTruthy();
  });

  test("should return false if karma is not running", () => {
    // Arrange
    const loggerMockedClass = <jest.Mock<Logger>>Logger;
    const karmaEventListener: jest.Mocked<KarmaEventListener> = new (KarmaEventListener as any)() as any;
    karmaEventListener.isServerLoaded = false;
    const karmaRunner = new KarmaRunner(karmaEventListener, new loggerMockedClass());

    // Act
    karmaRunner.isKarmaRunning();

    // Assert
    expect(karmaEventListener.isServerLoaded).toBeFalsy();
  });
});

describe("loadTests", () => {});
