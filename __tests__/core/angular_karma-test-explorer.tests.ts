import { AngularKarmaTestExplorer } from "../../src/core/angular-karma-test-explorer";
import { TestExplorerHelper } from "../../src/core/test-explorer/test-explorer-helper";
import { KarmaEventListener } from "../../src/core/integration/karma-event-listener";
import { AngularServer } from "../../src/core/angular/angular-server";
import { KarmaHelper } from "../../src/core/karma/karma-helper";
import { KarmaRunner } from "../../src/core/karma/karma-runner";
import { Logger } from "../../src/core/shared/logger";
import * as expectedTests from "../../__mocks__/expectedTests.mock";

jest.mock("../../src/core/integration/karma-event-listener");
jest.mock("../../src/core/angular/angular-server");
jest.mock("../../src/core/karma/karma-helper");
jest.mock("../../src/core/karma/karma-runner");
jest.mock("../../src/core/shared/logger");

let karmaRunner: jest.Mocked<KarmaRunner>;
let karmaHelper: jest.Mocked<KarmaHelper>;
let angularServer: jest.Mocked<AngularServer>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let logger: jest.Mocked<Logger>;

beforeEach(() => {
  karmaRunner = new (KarmaRunner as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  karmaHelper = new (KarmaHelper as any)() as any;
  angularServer = new (AngularServer as any)() as any;
  logger = new (Logger as any)() as any;
});

test("loadTests should return a valid set of tests if its the first run", async () => {
  // Arrange
  karmaHelper.isKarmaBasedProject.mockReturnValue(true);
  karmaRunner.isKarmaRunning.mockReturnValue(false);
  angularServer.start.mockResolvedValue();
  karmaRunner.loadTests.mockResolvedValue(expectedTests.mock);
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(
    karmaRunner,
    karmaHelper,
    logger,
    angularServer,
    new TestExplorerHelper(),
    karmaEventListener,
    ""
  );

  // Act
  const loadedTests = await angularKarmaTestExplorer.loadTests("test-project", 2000, "", "");

  // Assert
  expect(loadedTests.label).toBeDefined();
  expect(loadedTests.children).toBeDefined();
  expect(angularServer.stop).toBeCalledTimes(0);
  expect(angularServer.start).toBeCalledTimes(1);
});

test("loadTests should return a valid set of tests if its the reload run", async () => {
  // Arrange
  karmaHelper.isKarmaBasedProject.mockReturnValue(true);
  karmaRunner.isKarmaRunning.mockReturnValue(true);
  angularServer.start.mockResolvedValue();
  karmaRunner.loadTests.mockResolvedValue(expectedTests.mock);
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(
    karmaRunner,
    karmaHelper,
    logger,
    angularServer,
    new TestExplorerHelper(),
    karmaEventListener,
    ""
  );

  // Act
  const loadedTests = await angularKarmaTestExplorer.loadTests("test-project", 2000, "", "");

  // Assert
  expect(loadedTests.label).toBeDefined();
  expect(loadedTests.children).toBeDefined();
  expect(angularServer.stopAsync).toBeCalledTimes(1);
  expect(angularServer.start).toBeCalledTimes(1);
});

test("loadTests should return an empty test suite if its not a karma based project", async () => {
  // Arrange
  karmaHelper.isKarmaBasedProject.mockReturnValue(false);
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(
    karmaRunner,
    karmaHelper,
    logger,
    angularServer,
    new TestExplorerHelper(),
    karmaEventListener,
    ""
  );

  // Act
  const loadedTests = await angularKarmaTestExplorer.loadTests("test-project", 2000, "", "");

  // Assert
  expect(loadedTests.label).not.toBeDefined();
  expect(loadedTests.children).not.toBeDefined();
  expect(angularServer.stop).toBeCalledTimes(0);
  expect(angularServer.start).toBeCalledTimes(0);
});

test("runTests should be called only once with the correct sent tests name", async () => {
  // Arrange
  karmaRunner.runTests.mockResolvedValue();
  karmaEventListener.runCompleteEvent = { results: [] };
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(
    karmaRunner,
    karmaHelper,
    logger,
    angularServer,
    new TestExplorerHelper(),
    karmaEventListener,
    ""
  );
  const fakeTests = ["fakeTests"];

  // Act
  await angularKarmaTestExplorer.runTests(fakeTests);

  // Assert
  expect(karmaRunner.runTests).toBeCalledWith(fakeTests);
  expect(karmaRunner.runTests).toBeCalledTimes(1);
});

test("debug tests should throw not implemented exception", async () => {
  // Arrange
  const angularKarmaTestExplorer = new AngularKarmaTestExplorer(
    karmaRunner,
    karmaHelper,
    logger,
    angularServer,
    new TestExplorerHelper(),
    karmaEventListener,
    ""
  );
  const fakeTests = ["fakeTests"];

  // Act - Assert
  try {
    await angularKarmaTestExplorer.debugTests(fakeTests);
  } catch (e) {
    expect(e.message).toBe("Not Implemented");
  }
});
