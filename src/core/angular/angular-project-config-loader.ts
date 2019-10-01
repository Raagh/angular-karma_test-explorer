import { FileHelper } from "../integration/file-helper";
import { AngularProject } from "../../model/angular-project";
import { window } from "vscode";
import path = require("path");

export class AngularProjectConfigLoader {
  public constructor(private readonly fileHelper: FileHelper) {}

  public getDefaultAngularProjectConfig(workspaceRootPath: string, configDefaultProject?: string): AngularProject {
    const angularProjects = this.getAllAngularProjectsConfig(workspaceRootPath);
    let project = angularProjects.find(x => x.isAngularDefaultProject);
    if (configDefaultProject !== "") {
      project = angularProjects.find(x => x.name === configDefaultProject);
    }
    if (project === undefined) {
      project = angularProjects[0];
    }

    return project;
  }

  public getAllAngularProjectsConfig(workspaceRootPath: string): AngularProject[] {
    const angularJsonPath = path.join(workspaceRootPath, "angular.json");
    const angularCliJsonPath = path.join(workspaceRootPath, ".angular-cli.json");

    let projects: AngularProject[] = [];
    if (this.fileHelper.doesFileExists(angularJsonPath)) {
      projects = this.mapAngularJsonObject(workspaceRootPath, angularJsonPath);
    } else if (this.fileHelper.doesFileExists(angularCliJsonPath)) {
      projects = this.mapAngularCliJsonObject(workspaceRootPath, angularCliJsonPath);
    } else {
      const error = "No angular.json or angular-cli.json file found in root path.";
      window.showErrorMessage(error);
      throw new Error(error);
    }

    return projects;
  }

  private mapAngularCliJsonObject(workspaceRootPath: string, angularCliJsonPath: any): AngularProject[] {
    const angularJsonObject = this.fileHelper.readJSONFile(angularCliJsonPath);

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

  private mapAngularJsonObject(workspaceRootPath: string, angularJsonPath: any): AngularProject[] {
    const angularJsonObject = this.fileHelper.readJSONFile(angularJsonPath);

    const projects: AngularProject[] = [];
    for (const projectName of Object.keys(angularJsonObject.projects)) {
      const projectConfig = angularJsonObject.projects[projectName];
      if (projectConfig.architect.test === undefined || projectConfig.architect.test.options.karmaConfig  === undefined) {
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
