import { KarmaRunner } from './karma-runner';
import { AngularServer } from '../servers/angular-server';
import { TestSuiteInfo } from 'vscode-test-adapter-api';
import { OutputChannel } from 'vscode';
import { EventEmitter } from '../test-explorer/event-emitter';
import { TestExplorerHelper } from '../test-explorer/test-explorer-helper';
import { AngularProject } from '../../model/angular-project';
export class KarmaTestsLoader {
	private readonly angularServer: AngularServer;
	private readonly eventEmitter: EventEmitter;
	private readonly testExplorerHelper: TestExplorerHelper;
	private readonly karmaRunner: KarmaRunner;

	public constructor(
		private readonly baseKarmaConfigPath: string,
		channel: OutputChannel,
		eventEmitterInterface: any) {
		this.angularServer = new AngularServer(channel);
		this.karmaRunner = new KarmaRunner(channel);
		this.eventEmitter = new EventEmitter(eventEmitterInterface);
		this.testExplorerHelper = new TestExplorerHelper();
	}

	public async loadTestsFromAllProjects(workspaceRootPath: string): Promise<TestSuiteInfo> {
		const testSuiteInfo: TestSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("root", "Angular");
    const angularProjects = this.testExplorerHelper.getAllAngularProjects(workspaceRootPath);

		testSuiteInfo.children = await this.loadTestsFromEveryProjectToIndependentSuites(angularProjects);
		
		return testSuiteInfo;
	}
	
  private async loadTestsFromEveryProjectToIndependentSuites(angularProjects: AngularProject[]): Promise<TestSuiteInfo[]> {
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

    this.angularServer.start(project, this.baseKarmaConfigPath);
    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);
    return await this.karmaRunner.loadTests();
  }
}
