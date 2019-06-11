import path = require("path");

export class TestServerValidation {
  public constructor() {}

  public isValidProject(projectRootPath: string, projectType: string): boolean {
    return this.isAngularCLIProject(projectRootPath, projectType) || this.isAngularProject() || this.isKarmaProject();
  }

  public isAngularCLIProject(projectRootPath: string, projectType: string) {
    const fs = require("fs");
    const angularJsonPath = path.join(projectRootPath, "angular.json");
    const angularCliJsonPath = path.join(projectRootPath, ".angular-cli.json");

    return projectType == "AngularCLI" && (fs.existsSync(angularJsonPath) || fs.existsSync(angularCliJsonPath));
  }

  private isAngularProject() {
    return true;
  }

  private isKarmaProject() {
    return true;
  }
}
