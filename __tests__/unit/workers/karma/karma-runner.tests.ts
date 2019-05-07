import { KarmaHttpCaller } from "./../../../../src/workers/karma/karma-http-caller";
import { KarmaEventListener } from "./../../../../src/workers/karma/karma-event-listener";
import { KarmaRunner } from "./../../../../src/workers/karma/karma-runner";
import { Logger } from "../../../../src/workers/shared/logger";
import { TestSuiteInfo } from "vscode-test-adapter-api";

jest.mock("./../../../../src/workers/karma/karma-event-listener");
jest.mock("../../../../src/workers/shared/logger");
jest.mock("./../../../../src/workers/karma/karma-http-caller");

let loggerMockedClass: jest.Mock<Logger>;
let karmaHttpCaller: jest.Mocked<KarmaHttpCaller>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;

beforeAll(() => {
  loggerMockedClass = <jest.Mock<Logger>>Logger;
  karmaHttpCaller = new (KarmaHttpCaller as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
});

test("isKarmaRunning should return true if karma is running", () => {
  // Arrange
  karmaEventListener.isServerLoaded = true;
  const karmaRunner = new KarmaRunner(karmaEventListener, new loggerMockedClass(), karmaHttpCaller);

  // Act
  karmaRunner.isKarmaRunning();

  // Assert
  expect(karmaEventListener.isServerLoaded).toBeTruthy();
});

test("isKarmaRunning should return false if karma is not running", () => {
  // Arrange
  karmaEventListener.isServerLoaded = false;
  const karmaRunner = new KarmaRunner(karmaEventListener, new loggerMockedClass(), karmaHttpCaller);

  // Act
  karmaRunner.isKarmaRunning();

  // Assert
  expect(karmaEventListener.isServerLoaded).toBeFalsy();
});

test("loadTests should return valid tests when correct call is made to karma", async () => {
  // Arrange
  const mockLoadedTests = [
    {
      type: "suite",
      id: "root",
      label: "Angular",
      children: [],
    } as TestSuiteInfo,
  ];
  const mockLoadedConfig = { config: { hostname: "fakeHostname" }, tests: "" };
  karmaEventListener.isServerLoaded = false;
  karmaHttpCaller.callKarmaRunWithConfig.mockResolvedValue();
  karmaHttpCaller.createKarmaRunCallConfiguration.mockReturnValue(mockLoadedConfig as any);
  karmaEventListener.getLoadedTests.mockReturnValue(mockLoadedTests);

  const karmaRunner = new KarmaRunner(karmaEventListener, new loggerMockedClass(), karmaHttpCaller);

  // Act
  const result = await karmaRunner.loadTests();

  // Assert
  expect(karmaHttpCaller.callKarmaRunWithConfig).toBeCalledWith(expect.objectContaining(mockLoadedConfig.config));
  expect(result).toMatchObject(mockLoadedTests);
});

test("runTests should return valid tests when correct call is made to karma", async () => {
  // Arrange
  const mockLoadedTests = [
    {
      type: "suite",
      id: "root",
      label: "Angular",
      children: [],
    } as TestSuiteInfo,
  ];
  const mockLoadedConfig = { config: { hostname: "fakeHostname" }, tests: "fakeTest" };
  karmaEventListener.isServerLoaded = false;
  karmaHttpCaller.callKarmaRunWithConfig.mockResolvedValue();
  karmaHttpCaller.createKarmaRunCallConfiguration.mockReturnValue(mockLoadedConfig as any);
  karmaEventListener.getLoadedTests.mockReturnValue(mockLoadedTests);

  const karmaRunner = new KarmaRunner(karmaEventListener, new loggerMockedClass(), karmaHttpCaller);

  // Act
  await karmaRunner.runTests(["fakeTest"]);

  // Assert
  expect(karmaEventListener.isTestRunning).toBeTruthy();
  expect(karmaEventListener.lastRunTests).toBe("fakeTest");
  expect(karmaHttpCaller.callKarmaRunWithConfig).toBeCalledWith(expect.objectContaining(mockLoadedConfig.config));
});
