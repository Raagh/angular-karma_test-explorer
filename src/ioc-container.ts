import { AngularTestExplorer } from "./angular-test-explorer";
import { Logger } from "./workers/shared/logger";
import { KarmaHelper } from "./workers/karma/karma-helper";
import { KarmaEventListener } from "./workers/karma/karma-event-listener";
import { KarmaRunner } from "./workers/karma/karma-runner";
import { AngularServer } from "./workers/servers/angular-server";
import { AngularProjectConfigLoader } from "./workers/karma/angular-project-config-loader";
import { TestExplorerHelper } from "./workers/test-explorer/test-explorer-helper";
import { FileHelper } from "./workers/shared/file-helper";
import { KarmaHttpCaller } from "./workers/karma/karma-http-caller";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import * as vscode from "vscode";
import { EventEmitter } from "./workers/shared/event-emitter";
export class IOCContainer {
  public constructor() {}
  public registerTestExplorerDependencies(
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    channel: vscode.OutputChannel,
    isDebugMode: boolean,
    workspaceRootPath: string,
    baseKarmaConfigPath: string
  ): AngularTestExplorer {
    // poor man's dependency injection
    const karmaHelper = new KarmaHelper();
    const logger = new Logger(channel, isDebugMode);
    const karmaEventListener = new KarmaEventListener(logger, new EventEmitter(eventEmitterInterface));
    const karmaRunner = new KarmaRunner(karmaEventListener, logger, new KarmaHttpCaller());
    const angularServer = new AngularServer(karmaEventListener, logger);
    const testExplorerHelper = new TestExplorerHelper();

    const angularProjectLoader = new AngularProjectConfigLoader(workspaceRootPath, new FileHelper());

    return new AngularTestExplorer(
      karmaRunner,
      karmaHelper,
      logger,
      angularProjectLoader,
      angularServer,
      testExplorerHelper,
      karmaEventListener,
      workspaceRootPath,
      baseKarmaConfigPath
    );
  }
}
