import { AngularProject } from "./../../model/angular-project";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class TestExplorerHelper {
  public constructor() {}

  public createTestSuiteInfoRootElement(id: string, label: string) {
    return {
      type: "suite",
      id,
      label,
      children: [],
    } as TestSuiteInfo;
  }

  public groupBy(xs: any, key: any) {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  public removeElementsFromArrayWithoutModifyingIt(elements: any[] | undefined, elementsToRemove: any[]) {
    if (elements === undefined) {
      return [];
    }

    if (Array.isArray(elementsToRemove)) {
      return elements.filter(element => {
        if (typeof element === "object") {
          const key = Object.keys(element)[0];
          return !elementsToRemove.some(x => key in x);
        }

        return elementsToRemove.indexOf(element) < 0;
      });
    } else {
      return elements.filter(element => {
        return elementsToRemove !== element;
      });
    }
  }

  public getAllAngularProjects(workspaceRootPath: string): AngularProject[] {
    const fs = require("fs");
    const path = require("path");
    const angularJsonObject = JSON.parse(fs.readFileSync(path.join(workspaceRootPath, "angular.json"), "utf8"));

    const projects: AngularProject[] = [];
    Object.keys(angularJsonObject.projects).map((projectName: any) => {
      const projectConfig = angularJsonObject.projects[projectName];
      if (projectConfig.architect.test === undefined) {
        return;
      }

      const projectPath = path.join(workspaceRootPath, projectConfig.root);
      const karmaConfigPath = path.join(workspaceRootPath, projectConfig.architect.test.options.karmaConfig);
      const isAngularDefaultProject = angularJsonObject.defaultProject === projectName;
      const project = new AngularProject(projectName, projectPath, karmaConfigPath, isAngularDefaultProject);

      projects.push(project);
    });

    return projects;
  }
}
