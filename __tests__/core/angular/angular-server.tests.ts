import { AngularServer } from "../../../src/core/angular/angular-server";
import { AngularProjectConfigLoader } from "../../../src/core/angular/angular-project-config-loader";
import { KarmaEventListener } from "../../../src/core/integration/karma-event-listener";
import { FileHelper } from "../../../src/core/integration/file-helper";
import { Logger } from "../../../src/core/shared/logger";
import { AngularProject } from "../../../src/model/angular-project";
import { TestExplorerConfiguration } from "../../../src/model/test-explorer-configuration";
import { AngularProcessConfigurator } from "../../../src/core/angular/angular-process-configurator";
import { CommandlineProcessHandler } from "../../../src/core/integration/commandline-process-handler";

jest.mock("../../../src/core/angular/angular-project-config-loader");
jest.mock("../../../src/core/integration/commandline-process-handler");
jest.mock("../../../src/core/integration/karma-event-listener");
jest.mock("../../../src/core/integration/file-helper");
jest.mock("../../../src/core/shared/logger");

let fileHelper: jest.Mocked<FileHelper>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let processHandler: jest.Mocked<CommandlineProcessHandler>;
let angularProjectConfigLoader: jest.Mocked<AngularProjectConfigLoader>;
let loggerMockedClass: jest.Mock<Logger>;
let testExplorerConfiguration: TestExplorerConfiguration;

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  processHandler = new (CommandlineProcessHandler as any)() as any;
  angularProjectConfigLoader = new (AngularProjectConfigLoader as any)() as any;
  loggerMockedClass = <jest.Mock<Logger>>Logger;
  testExplorerConfiguration = {
    projectRootPath: "",
    defaultAngularProjectName: "",
    defaultSocketConnectionPort: 2000,
    userKarmaConfFilePath: "",
    baseKarmaConfFilePath: "",
  } as TestExplorerConfiguration;
});

test("start should effectively start a new angular process", async () => {
  // Arrange
  angularProjectConfigLoader.getDefaultAngularProjectConfig.mockReturnValue(new AngularProject("test-project", "", "", true));
  fileHelper.doesFileExists.mockReturnValue(true);
  processHandler.create.mockReturnValue({ stdout: { on() {} }, stderr: { on() {} }, on() {} });
  const angularServer = new AngularServer(
    karmaEventListener,
    new loggerMockedClass(),
    processHandler,
    angularProjectConfigLoader,
    new AngularProcessConfigurator(fileHelper)
  );

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
  const angularServer = new AngularServer(
    karmaEventListener,
    new loggerMockedClass(),
    processHandler,
    angularProjectConfigLoader,
    new AngularProcessConfigurator(fileHelper)
  );

  // Act
  angularServer.stop();

  // Assert
  expect(processHandler.kill).toBeCalledTimes(1);
  expect(karmaEventListener.stopListeningToKarma).toBeCalledTimes(1);
});
