import { KarmaServer } from "../../../src/core/karma/karma-server";
import { ProjectType } from "../../../src/model/enums/project-type.enum";
import { AngularServer } from "../../../src/core/angular/angular-server";
import { TestServerFactory } from "../../../src/core/test-server/test-server-factory";
import { KarmaEventListener } from "../../../src/core/integration/karma-event-listener";
import { FileHelper } from "../../../src/core/integration/file-helper";
import { Logger } from "../../../src/core/shared/logger";

jest.mock("../../../src/core/integration/karma-event-listener");
jest.mock("../../../src/core/integration/file-helper");
jest.mock("../../../src/core/shared/logger");

let fileHelper: jest.Mocked<FileHelper>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let loggerMockedClass: jest.Mock<Logger>;

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  loggerMockedClass = <jest.Mock<Logger>>Logger;
});

test("if is a AngularCLI project it should return an angular server instance", () => {
  // Arrange
  const testServerFactory = new TestServerFactory(karmaEventListener, new loggerMockedClass(), fileHelper);

  // Act
  const testServer = testServerFactory.createTestServer(ProjectType.AngularCLI);

  // Assert
  expect(testServer).toBeInstanceOf(AngularServer);
});

test("if is a karma project it should return an karma server instance", () => {
  // Arrange
  const testServerFactory = new TestServerFactory(karmaEventListener, new loggerMockedClass(), fileHelper);

  // Act
  const testServer = testServerFactory.createTestServer(ProjectType.Karma);

  // Assert
  expect(testServer).toBeInstanceOf(KarmaServer);
});

test("if is a Angular(Non CLI) project it should return an karma server instance", () => {
  // Arrange
  const testServerFactory = new TestServerFactory(karmaEventListener, new loggerMockedClass(), fileHelper);

  // Act
  const testServer = testServerFactory.createTestServer(ProjectType.Angular);

  // Assert
  expect(testServer).toBeInstanceOf(KarmaServer);
});
