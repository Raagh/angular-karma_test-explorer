import { KarmaServer } from "../../../src/core/karma/karma-server";
import { KarmaEventListener } from "../../../src/core/integration/karma-event-listener";
import { FileHelper } from "../../../src/core/integration/file-helper";
import { Logger } from "../../../src/core/shared/logger";
import { TestExplorerConfiguration } from "../../../src/model/test-explorer-configuration";
import { CommandlineProcessHandler } from "../../../src/core/integration/commandline-process-handler";
import { KarmaProcessConfigurator } from "../../../src/core/karma/karma-process-configurator";

jest.mock("../../../src/core/integration/karma-event-listener");
jest.mock("../../../src/core/integration/file-helper");
jest.mock("../../../src/core/integration/commandline-process-handler");
jest.mock("../../../src/core/shared/logger");

let fileHelper: jest.Mocked<FileHelper>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let processHandler: jest.Mocked<CommandlineProcessHandler>;
let loggerMockedClass: jest.Mock<Logger>;
let testExplorerConfiguration: TestExplorerConfiguration;

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  loggerMockedClass = <jest.Mock<Logger>>Logger;
  processHandler = new (CommandlineProcessHandler as any)() as any;
  testExplorerConfiguration = {
    angularProjectPath: "",
    defaultAngularProjectName: "",
    defaultSocketConnectionPort: 2000,
    userKarmaConfFilePath: "",
    baseKarmaConfFilePath: "",
  } as TestExplorerConfiguration;
});

test("start should effectively start a new karma process", async () => {
  // Arrange
  fileHelper.doesFileExists.mockReturnValue(true);
  const karmaServer = new KarmaServer(karmaEventListener, new loggerMockedClass(), processHandler, new KarmaProcessConfigurator());

  // Act
  await karmaServer.start(testExplorerConfiguration);

  // Assert
  expect(karmaEventListener.listenTillKarmaReady).toBeCalledTimes(1);
  expect(karmaEventListener.listenTillKarmaReady).toBeCalledWith(2000);
});

test("stop should effectively stop a the running karma process", async () => {
  // Arrange
  karmaEventListener.isServerLoaded = true;
  const karmaServer = new KarmaServer(karmaEventListener, new loggerMockedClass(), processHandler, new KarmaProcessConfigurator());

  // Act
  karmaServer.stop();

  // Assert
  expect(karmaEventListener.stopListeningToKarma).toBeCalledTimes(1);
});
