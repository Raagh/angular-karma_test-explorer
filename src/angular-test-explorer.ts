import { EventEmitter } from "./workers/test-explorer/event-emitter";
import * as vscode from "vscode";
import { AngularServer } from "./workers/servers/angular-server";
import { KarmaRunner } from "./workers/karma/karma-runner";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { KarmaHelper } from "./workers/karma/karma-helper";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import path = require("path");
import { TestExplorerHelper } from './workers/test-explorer/test-explorer-helper';

export class AngularTestExplorer {
  private readonly karmaRunner: KarmaRunner;
  private readonly eventEmitter: EventEmitter;
  private readonly karmaHelper: KarmaHelper;
  private readonly testExplorerHelper : TestExplorerHelper;
  private angularServer: AngularServer;
  private baseKarmaConfigPath: string = path.join(__dirname, ".", "config", "test-explorer-karma.conf.js");

  public constructor(
    private readonly workspaceRootPath: string,
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
  ) {
    this.karmaHelper = new KarmaHelper();
    this.karmaRunner = new KarmaRunner();
    this.eventEmitter = new EventEmitter(eventEmitterInterface);
    this.testExplorerHelper = new TestExplorerHelper();
  }

  public async loadTestsByProject(): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(this.workspaceRootPath)) {
      return {} as TestSuiteInfo;
    }

    const testSuiteInfo: TestSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("Angular");

    const angularProjects = this.testExplorerHelper.getAllAngularProjects(this.workspaceRootPath, this.baseKarmaConfigPath);

    testSuiteInfo.children = angularProjects.reduce(async (project: any) => await this.loadTestsFromSingleProject(project));

    return testSuiteInfo;
  }

  public async runTests(tests: any): Promise<void> {
    await this.karmaRunner.runTests(tests);
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }

  private async loadTestsFromSingleProject(project: any): Promise<TestSuiteInfo[]> {
    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun(); 
    }

    this.angularServer = new AngularServer(project.rootPath, project.karmaConfPath);
    this.angularServer.start();
    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);
    return await this.karmaRunner.loadTests();
  }
}
