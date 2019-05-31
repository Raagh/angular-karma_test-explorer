import { TestServerFactory } from "./../core/test-server/test-server-factory";
import { AngularKarmaTestExplorer } from "../core/angular-karma-test-explorer";
import { Logger } from "../core/shared/logger";
import { TestServerValidation } from "../core/test-server/test-server-validation";
import { KarmaEventListener } from "../core/integration/karma-event-listener";
import { KarmaRunner } from "../core/karma/karma-runner";
import { TestExplorerHelper } from "../core/test-explorer/test-explorer-helper";
import { FileHelper } from "../core/integration/file-helper";
import { KarmaHttpClient } from "../core/integration/karma-http-client";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import { EventEmitter } from "../core/shared/event-emitter";
import { ProjectType } from "../model/project-type.enum";
import * as vscode from "vscode";

export class IOCContainer {
  public constructor() {}
  public registerTestExplorerDependencies(
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    channel: vscode.OutputChannel,
    isDebugMode: boolean,
    projectType: ProjectType
  ): AngularKarmaTestExplorer {
    // poor man's dependency injection
    const karmaHelper = new TestServerValidation();
    const fileHelper = new FileHelper();
    const testExplorerHelper = new TestExplorerHelper();
    const logger = new Logger(channel, isDebugMode);
    const karmaEventListener = new KarmaEventListener(logger, new EventEmitter(eventEmitterInterface));
    const karmaRunner = new KarmaRunner(karmaEventListener, logger, new KarmaHttpClient());
    const testServerFactory = new TestServerFactory(karmaEventListener, logger, fileHelper);
    const testServer = testServerFactory.createTestServer(projectType);

    return new AngularKarmaTestExplorer(karmaRunner, karmaHelper, logger, testServer, testExplorerHelper, karmaEventListener);
  }
}
