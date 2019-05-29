import { AngularNonCliServer } from "./../../../src/core/angular/angular-non-cli-server";
import { AngularProcessHandler } from "../../../src/core/integration/angular-process-handler";
import { KarmaEventListener } from "../../../src/core/integration/karma-event-listener";
import { FileHelper } from "../../../src/core/integration/file-helper";
import { Logger } from "../../../src/core/shared/logger";
import { TestExplorerConfiguration } from "../../../src/model/test-explorer-configuration";

jest.mock("../../../src/core/integration/angular-process-handler");
jest.mock("../../../src/core/integration/karma-event-listener");
jest.mock("../../../src/core/integration/file-helper");
jest.mock("../../../src/core/shared/logger");

let fileHelper: jest.Mocked<FileHelper>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let processHandler: jest.Mocked<AngularProcessHandler>;
let loggerMockedClass: jest.Mock<Logger>;
let testExplorerConfiguration: TestExplorerConfiguration;

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  processHandler = new (AngularProcessHandler as any)() as any;
  loggerMockedClass = <jest.Mock<Logger>>Logger;
  testExplorerConfiguration = {
    angularProjectPath: "",
    defaultAngularProjectName: "",
    defaultSocketConnectionPort: 2000,
    userKarmaConfFilePath: "",
    baseKarmaConfFilePath: "",
  } as TestExplorerConfiguration;
});

test("start should effectively start a new angular process", () => {
  // Arrange
  fileHelper.doesFileExists.mockReturnValue(true);
  processHandler.create.mockReturnValue({ stdout: { on() {} }, stderr: { on() {} }, on() {} });
  const angularServer = new AngularNonCliServer(karmaEventListener, new loggerMockedClass(), processHandler, fileHelper);
  // Act
  angularServer.start(testExplorerConfiguration);

  // Assert
  expect(processHandler.create).toBeCalledTimes(1);
  expect(karmaEventListener.listenTillKarmaReady).toBeCalledTimes(1);
  expect(karmaEventListener.listenTillKarmaReady).toBeCalledWith(2000);
});

test("stop should effectively stop a the running angular process", async () => {
  // Arrange
  karmaEventListener.isServerLoaded = true;
  const angularServer = new AngularNonCliServer(karmaEventListener, new loggerMockedClass(), processHandler, fileHelper);

  // Act
  angularServer.stop();

  // Assert
  expect(processHandler.kill).toBeCalledTimes(1);
  expect(karmaEventListener.stopListeningToKarma).toBeCalledTimes(1);
});
