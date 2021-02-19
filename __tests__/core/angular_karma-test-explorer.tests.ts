import { TestExplorerConfiguration } from "./../../src/model/test-explorer-configuration";
import { AngularKarmaTestExplorer } from "../../src/core/angular-karma-test-explorer";
import { KarmaEventListener } from "../../src/core/integration/karma-event-listener";
import { AngularServer } from "../../src/core/angular/angular-server";
import { TestServerValidation } from "../../src/core/test-server/test-server-validation";
import { KarmaRunner } from "../../src/core/karma/karma-runner";
import { Logger } from "../../src/core/shared/logger";
import * as expectedTests from "../../__mocks__/expectedTests.mock";

jest.mock("../../src/core/integration/karma-event-listener");
jest.mock("../../src/core/angular/angular-server");
jest.mock("../../src/core/test-server/test-server-validation");
jest.mock("../../src/core/karma/karma-runner");
jest.mock("../../src/core/shared/logger");

let karmaRunner: jest.Mocked<KarmaRunner>;
let testServerValidation: jest.Mocked<TestServerValidation>;
let angularServer: jest.Mocked<AngularServer>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let logger: jest.Mocked<Logger>;
let testExplorerConfiguration: TestExplorerConfiguration;

beforeEach(() => {
  karmaRunner = new (KarmaRunner as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  testServerValidation = new (TestServerValidation as any)() as any;
  angularServer = new (AngularServer as any)() as any;
  logger = new (Logger as any)() as any;
  testExplorerConfiguration = {
    projectRootPath: "",
    defaultAngularProjectName: "",
    defaultSocketConnectionPort: 2000,
    userKarmaConfFilePath: "",
  } as TestExplorerConfiguration;
});

test("loadTests should return a valid set of tests if its the first run", async () => {
  // Arrange
  testServerValidation.isValidProject.mockReturnValue(true);
  karmaRunner.isKarmaRunning.mockReturnValue(false);
  angularServer.start.mockResolvedValue("");
  karmaRunner.loadTests.mockResolvedValue(expectedTests.mock);
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.loadTests(testExplorerConfiguration);

  // Assert
  // expect(loadedTests?.label).toBeDefined();
  // expect(loadedTests?.children).toBeDefined();
  expect(angularServer.stop).toBeCalledTimes(0);
  expect(angularServer.start).toBeCalledTimes(1);
});

test("loadTests should return a valid set of tests if its the reload run", async () => {
  // Arrange
  testServerValidation.isValidProject.mockReturnValue(true);
  karmaRunner.isKarmaRunning.mockReturnValue(true);
  angularServer.start.mockResolvedValue("");
  karmaRunner.loadTests.mockResolvedValue(expectedTests.mock);
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.loadTests(testExplorerConfiguration);

  // Assert
  // expect(loadedTests?.label).toBeDefined();
  // expect(loadedTests?.children).toBeDefined();
  expect(angularServer.stopAsync).toBeCalledTimes(1);
  expect(angularServer.start).toBeCalledTimes(1);
});

test("loadTests should return an empty test suite if its not a karma based project", async () => {
  // Arrange
  testServerValidation.isValidProject.mockReturnValue(false);
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.loadTests(testExplorerConfiguration);

  // Assert
  // expect(loadedTests?.label).not.toBeDefined();
  // expect(loadedTests?.children).not.toBeDefined();
  expect(angularServer.stop).toBeCalledTimes(0);
  expect(angularServer.start).toBeCalledTimes(0);
});

test("runTests should be called only once with the correct sent tests name", async () => {
  // Arrange
  karmaRunner.runTests.mockResolvedValue();
  karmaEventListener.runCompleteEvent = { results: [] };
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);
  const fakeTests = ["fakeTests"];

  // Act
  await angularKarmaTestExplorer.runTests(fakeTests, true);

  // Assert
  expect(karmaRunner.runTests).toBeCalledWith(fakeTests, true);
  expect(karmaRunner.runTests).toBeCalledTimes(1);
});

test("stopCurrentRun should stop server if server karma server is running", async () => {
  // Arrange
  karmaRunner.isKarmaRunning.mockReturnValue(true);
  karmaEventListener.runCompleteEvent = { results: [] };
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.stopCurrentRun();

  // Assert
  expect(angularServer.stopAsync).toBeCalledTimes(1);
});

test("stopCurrentRun should not stop server if server karma server is not running", async () => {
  // Arrange
  karmaRunner.isKarmaRunning.mockReturnValue(false);
  karmaEventListener.runCompleteEvent = { results: [] };
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.stopCurrentRun();

  // Assert
  expect(angularServer.stopAsync).toBeCalledTimes(0);
});

test("dispose should stop server if server karma server is running", async () => {
  // Arrange
  karmaRunner.isKarmaRunning.mockReturnValue(true);
  karmaEventListener.runCompleteEvent = { results: [] };
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.dispose();

  // Assert
  expect(angularServer.stop).toBeCalledTimes(1);
});

test("dispose should not stop server if server karma server is not running", async () => {
  // Arrange
  karmaRunner.isKarmaRunning.mockReturnValue(false);
  karmaEventListener.runCompleteEvent = { results: [] };
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(karmaRunner, testServerValidation, logger, angularServer, karmaEventListener);

  // Act
  await angularKarmaTestExplorer.dispose();

  // Assert
  expect(angularServer.stop).toBeCalledTimes(0);
});
