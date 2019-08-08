import { TestServerFactory } from "./../core/test-server/test-server-factory";
import { AngularKarmaTestExplorer } from "../core/angular-karma-test-explorer";
import { Logger } from "../core/shared/logger";
import { TestServerValidation } from "../core/test-server/test-server-validation";
import { KarmaEventListener } from "../core/integration/karma-event-listener";
import { KarmaRunner } from "../core/karma/karma-runner";
import { FileHelper } from "../core/integration/file-helper";
import { KarmaHttpClient } from "../core/integration/karma-http-client";
import {
  TestRunStartedEvent,
  TestRunFinishedEvent,
  TestSuiteEvent,
  TestEvent,
  TestLoadStartedEvent,
  TestLoadFinishedEvent,
} from "vscode-test-adapter-api";
import { EventEmitter } from "../core/shared/event-emitter";
import { ProjectType } from "../model/enums/project-type.enum";
import * as vscode from "vscode";
import { Debugger } from "../core/test-explorer/debugger";

export class IOCContainer {
  public constructor(private readonly channel: vscode.OutputChannel, private readonly isDebugMode: boolean) {}
  public registerTestExplorerDependencies(
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
    testLoadedEmitterInterface: vscode.EventEmitter<TestLoadStartedEvent | TestLoadFinishedEvent>,
    projectType: ProjectType
  ): AngularKarmaTestExplorer {
    // poor man's dependency injection
    const fileHelper = new FileHelper();
    const karmaHelper = new TestServerValidation(fileHelper);
    const logger = new Logger(this.channel, this.isDebugMode);
    const karmaEventListener = new KarmaEventListener(logger, new EventEmitter(eventEmitterInterface, testLoadedEmitterInterface));
    const karmaRunner = new KarmaRunner(karmaEventListener, logger, new KarmaHttpClient());
    const testServerFactory = new TestServerFactory(karmaEventListener, logger, fileHelper);
    const testServer = testServerFactory.createTestServer(projectType);

    return new AngularKarmaTestExplorer(karmaRunner, karmaHelper, logger, testServer, karmaEventListener);
  }

  public registerDebuggerDependencies(): Debugger {
    return new Debugger(new Logger(this.channel, this.isDebugMode));
  }
}
