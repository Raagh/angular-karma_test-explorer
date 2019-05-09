import { AngularKarmaTestExplorer } from "../core/angular-karma-test-explorer";
import { Logger } from "../core/shared/logger";
import { KarmaHelper } from "../core/karma/karma-helper";
import { KarmaEventListener } from "../core/integration/karma-event-listener";
import { KarmaRunner } from "../core/karma/karma-runner";
import { AngularServer } from "../core/angular/angular-server";
import { AngularProjectConfigLoader } from "../core/angular/angular-project-config-loader";
import { TestExplorerHelper } from "../core/test-explorer/test-explorer-helper";
import { FileHelper } from "../core/integration/file-helper";
import { KarmaHttpClient } from "../core/integration/karma-http-client";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import * as vscode from "vscode";
import { EventEmitter } from "../core/shared/event-emitter";
import { AngularProcessHandler } from "../core/integration/angular-process-handler";
export class IOCContainer {
  public constructor() {}
  public registerTestExplorerDependencies(
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    channel: vscode.OutputChannel,
    isDebugMode: boolean,
    workspaceRootPath: string,
    baseKarmaConfigPath: string
  ): AngularKarmaTestExplorer {
    // poor man's dependency injection
    const karmaHelper = new KarmaHelper();
    const fileHelper = new FileHelper();
    const testExplorerHelper = new TestExplorerHelper();
    const logger = new Logger(channel, isDebugMode);
    const karmaEventListener = new KarmaEventListener(logger, new EventEmitter(eventEmitterInterface));
    const karmaRunner = new KarmaRunner(karmaEventListener, logger, new KarmaHttpClient());
    const angularProjectConfigLoader = new AngularProjectConfigLoader(workspaceRootPath, fileHelper);
    const angularServer = new AngularServer(
      karmaEventListener,
      logger,
      new AngularProcessHandler(logger, karmaEventListener),
      fileHelper,
      angularProjectConfigLoader
    );

    return new AngularKarmaTestExplorer(
      karmaRunner,
      karmaHelper,
      logger,
      angularServer,
      testExplorerHelper,
      karmaEventListener,
      workspaceRootPath,
      baseKarmaConfigPath
    );
  }
}
