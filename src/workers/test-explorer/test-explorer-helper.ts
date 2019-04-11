import { TestSuiteInfo } from 'vscode-test-adapter-api';
import path = require("path");


export class TestExplorerHelper {
  public constructor() {}

  public createTestSuiteInfoRootElement(typeOfProject: string) {
    return {
      type: "suite",
      id: "root",
      label: typeOfProject,
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

  public getAllAngularProjects(workspaceRootPath: string, baseKarmaConfigPath: string ): any {
    const fs = require("fs");
    const angularJsonObject = JSON.parse(fs.readFileSync(path.join(workspaceRootPath, 'angular.json'),'utf8'));
    
    return angularJsonObject;
  }
}
