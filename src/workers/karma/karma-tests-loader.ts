import { KarmaRunner } from "./karma-runner";
import { AngularServer } from "../servers/angular-server";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { TestExplorerHelper } from "../test-explorer/test-explorer-helper";
import { AngularProject } from '../../model/angular-project';
import { window } from 'vscode';
import fs = require("fs");
import path = require("path");

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
    const angularProjects = this.getAllAngularProjects(this.workspaceRootPath);
    let project = angularProjects.find(x => x.isAngularDefaultProject);
    if (configDefaultProject !== "") {
      project = angularProjects.find(x => x.name === configDefaultProject);
    }
    if (project === undefined) {
      project = angularProjects[0];
    }
    return project;
  }

  private getAllAngularProjects(workspaceRootPath: string): AngularProject[] {
    const angularJsonPath = path.join(workspaceRootPath, "angular.json");
    const angularCliJsonPath = path.join(workspaceRootPath, ".angular-cli.json");

    let projects: AngularProject[] = [];
    if (fs.existsSync(angularJsonPath)) {
      projects = this.mapAngularJsonObject(workspaceRootPath, angularJsonPath);
    } else if (fs.existsSync(angularCliJsonPath)) {
      projects = this.mapAngularCliJsonObject(workspaceRootPath, angularCliJsonPath);
    } else {  
      const error = "No angular.json or angular-cli.json file found in root path.";
      window.showErrorMessage(error);
      throw new Error(error);
    }

    return projects;
  }

  private mapAngularCliJsonObject(workspaceRootPath: string, angularCliJsonPath: any) {
    const angularJsonObject = JSON.parse(fs.readFileSync(angularCliJsonPath, "utf8"));

    const projects: AngularProject[] = [];
    for (const app of angularJsonObject.apps) {
      const appName = app.name || angularJsonObject.project.name;

      const appPath = path.join(workspaceRootPath, app.root);
      const karmaConfigPath = path.join(workspaceRootPath, angularJsonObject.test.karma.config);
      const isAngularDefaultProject = angularJsonObject.project.name === appName;
      const project = new AngularProject(appName, appPath, karmaConfigPath, isAngularDefaultProject);

      projects.push(project);
    }   

    return projects;
  }

  private mapAngularJsonObject(workspaceRootPath: string, angularJsonPath: any) {
    const angularJsonObject = JSON.parse(fs.readFileSync(angularJsonPath, "utf8"));

    const projects: AngularProject[] = [];
    for (const projectName of Object.keys(angularJsonObject.projects)) {
      const projectConfig = angularJsonObject.projects[projectName];
      if (projectConfig.architect.test === undefined) {
        continue;
      }

      const projectPath = path.join(workspaceRootPath, projectConfig.root);
      const karmaConfigPath = path.join(workspaceRootPath, projectConfig.architect.test.options.karmaConfig);
      const isAngularDefaultProject = angularJsonObject.defaultProject === projectName;
      const project = new AngularProject(projectName, projectPath, karmaConfigPath, isAngularDefaultProject);

      projects.push(project);
    }

    return projects;
  }
}
