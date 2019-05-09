import { AngularServer } from "../../../../src/core/angular/angular-server";
import { AngularProjectConfigLoader } from "../../../../src/core/angular/angular-project-config-loader";
import { AngularProcessHandler } from "../../../../src/core/integration/angular-process-handler";
import { KarmaEventListener } from "../../../../src/core/integration/karma-event-listener";
import { FileHelper } from "../../../../src/core/shared/file-helper";
import { Logger } from "../../../../src/core/shared/logger";
import { AngularProject } from "../../../../src/model/angular-project";

jest.mock("../../../../src/core/angular/angular-project-config-loader");
jest.mock("../../../../src/core/integration/angular-process-handler");
jest.mock("./../../../../src/core/integration/karma-event-listener");
jest.mock("./../../../../src/core/shared/file-helper");
jest.mock("../../../../src/core/shared/logger");

let fileHelper: jest.Mocked<FileHelper>;
let karmaEventListener: jest.Mocked<KarmaEventListener>;
let processHandler: jest.Mocked<AngularProcessHandler>;
let angularProjectConfigLoader: jest.Mocked<AngularProjectConfigLoader>;
let loggerMockedClass: jest.Mock<Logger>;

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
  karmaEventListener = new (KarmaEventListener as any)() as any;
  processHandler = new (AngularProcessHandler as any)() as any;
  angularProjectConfigLoader = new (AngularProjectConfigLoader as any)() as any;
  loggerMockedClass = <jest.Mock<Logger>>Logger;
});

test("start should effectively start a new angular process", async () => {
  // Arrange
  angularProjectConfigLoader.load.mockReturnValue(new AngularProject("test-project", "", "", true));
  fileHelper.doesFileExists.mockReturnValue(true);
  processHandler.create.mockReturnValue({ stdout: { on() {} }, stderr: { on() {} }, on() {} });
  const angularServer = new AngularServer(karmaEventListener, new loggerMockedClass(), processHandler, fileHelper, angularProjectConfigLoader);

  // Act
  angularServer.start("", "", 2000);

  // Assert
  expect(processHandler.create).toBeCalledTimes(1);
  expect(karmaEventListener.listenTillKarmaReady).toBeCalledTimes(1);
  expect(karmaEventListener.listenTillKarmaReady).toBeCalledWith(2000);
});

test("stop should effectively stop a the running angular process", async () => {
  // Arrange
  karmaEventListener.isServerLoaded = true;
  const angularServer = new AngularServer(karmaEventListener, new loggerMockedClass(), processHandler, fileHelper, angularProjectConfigLoader);

  // Act
  angularServer.stop();

  // Assert
  expect(processHandler.kill).toBeCalledTimes(1);
  expect(karmaEventListener.stopListeningToKarma).toBeCalledTimes(1);
  expect(processHandler.onExitEvent).toBeCalledTimes(1);
});
