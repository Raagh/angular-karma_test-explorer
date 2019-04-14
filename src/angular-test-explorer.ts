import { AngularProject } from './model/angular-project';
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
  public constructor(
    private readonly workspaceRootPath: string,
    eventEmitterInterface: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>
  ) {
    this.karmaHelper = new KarmaHelper();
    this.karmaRunner = new KarmaRunner();
    this.angularServer = new AngularServer();
    this.eventEmitter = new EventEmitter(eventEmitterInterface);
    this.testExplorerHelper = new TestExplorerHelper();
  }

  public async loadTestsByProject(): Promise<TestSuiteInfo> {
    if (!this.karmaHelper.isKarmaBasedProject(this.workspaceRootPath)) {
      return {} as TestSuiteInfo;
    }

    const testSuiteInfo: TestSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("root", "Angular");

    const angularProjects = this.testExplorerHelper.getAllAngularProjects(this.workspaceRootPath);

    testSuiteInfo.children = await this.loadTestsFromEveryProjectToIndependentSuites(angularProjects);

    return testSuiteInfo;
  }

  public async runTests(tests: any): Promise<void> {
    await this.karmaRunner.runTests(tests);
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }

  private async loadTestsFromEveryProjectToIndependentSuites(angularProjects: AngularProject[], ) : Promise<TestSuiteInfo[]> {
    const children: TestSuiteInfo[] = [];

    for (const project of angularProjects) {
      const projectRoot = this.testExplorerHelper.createTestSuiteInfoRootElement(project.name, project.name);
      projectRoot.children = await this.loadTestsFromSingleProject(project);
      children.push(projectRoot);
    }

    return children;
  }

  private async loadTestsFromSingleProject(project: AngularProject): Promise<TestSuiteInfo[]> {
    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun(); 
    }

    const baseKarmaConfigPath = path.join(__dirname, ".", "config", "test-explorer-karma.conf.js");

    this.angularServer.start(project, baseKarmaConfigPath);
    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);
    return await this.karmaRunner.loadTests();
  }
}
