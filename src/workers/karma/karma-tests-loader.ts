import { KarmaRunner } from './karma-runner';
import { AngularServer } from '../servers/angular-server';
import { TestSuiteInfo } from 'vscode-test-adapter-api';
import { OutputChannel } from 'vscode';
import { EventEmitter } from '../test-explorer/event-emitter';
import { TestExplorerHelper } from '../test-explorer/test-explorer-helper';

export class KarmaTestsLoader {
	private readonly angularServer: AngularServer;
	private readonly eventEmitter: EventEmitter;
	private readonly testExplorerHelper: TestExplorerHelper;
  private readonly karmaRunner: KarmaRunner;

	public constructor(
    private readonly baseKarmaConfigPath: string,
    private readonly workspaceRootPath: string,
		channel: OutputChannel,
		eventEmitterInterface: any) {
		this.angularServer = new AngularServer(channel);
		this.karmaRunner = new KarmaRunner(channel);
		this.eventEmitter = new EventEmitter(eventEmitterInterface);
		this.testExplorerHelper = new TestExplorerHelper();
	}
  
  public async loadTestsFromDefaultProject(configDefaultProject: string): Promise<TestSuiteInfo> {
    const testSuiteInfo: TestSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("root", "Angular");

    const angularProjects = this.testExplorerHelper.getAllAngularProjects(this.workspaceRootPath);
    let project = angularProjects.find(x => x.isAngularDefaultProject);

    if (configDefaultProject !== undefined) {
      project = angularProjects.find(x => x.name === configDefaultProject);
    }

    if (project === undefined) {
      project = angularProjects[0];
    }

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun();
    }

    this.angularServer.start(project, this.baseKarmaConfigPath);
    await this.karmaRunner.waitTillKarmaIsRunning(this.eventEmitter);
    testSuiteInfo.children = await this.karmaRunner.loadTests();
    return testSuiteInfo
  }
}
