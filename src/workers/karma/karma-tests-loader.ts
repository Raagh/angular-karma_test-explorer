import { KarmaRunner } from "./karma-runner";
import { AngularServer } from "../servers/angular-server";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestExplorerHelper } from "../test-explorer/test-explorer-helper";

export class KarmaTestsLoader {
  public constructor(
    private readonly baseKarmaConfigPath: string,
    private readonly workspaceRootPath: string,
    private readonly angularServer: AngularServer,
    private readonly testExplorerHelper: TestExplorerHelper,
    private readonly karmaRunner: KarmaRunner
  ) {}

  public async loadTestsFromDefaultProject(configDefaultProject: string | undefined, defaultSocketPort: number | undefined): Promise<TestSuiteInfo> {
    const testSuiteInfo: TestSuiteInfo = this.testExplorerHelper.createTestSuiteInfoRootElement("root", "Angular");

    const project = this.getDefaultAngularProjectInformation(configDefaultProject);

    if (this.karmaRunner.isKarmaRunning()) {
      await this.angularServer.stopPreviousRun();
    }

    this.angularServer.start(project, this.baseKarmaConfigPath);
    await this.karmaRunner.waitTillKarmaIsRunning(defaultSocketPort);
    testSuiteInfo.children = await this.karmaRunner.loadTests();
    return testSuiteInfo;
  }

  private getDefaultAngularProjectInformation(configDefaultProject: string | undefined) {
    const angularProjects = this.testExplorerHelper.getAllAngularProjects(this.workspaceRootPath);
    let project = angularProjects.find(x => x.isAngularDefaultProject);
    if (configDefaultProject !== "") {
      project = angularProjects.find(x => x.name === configDefaultProject);
    }
    if (project === undefined) {
      project = angularProjects[0];
    }
    return project;
  }
}
