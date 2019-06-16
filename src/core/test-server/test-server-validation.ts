import path = require("path");
import { FileHelper } from "../integration/file-helper";

export class TestServerValidation {
  public constructor(private readonly fileHelper: FileHelper) {}

  public isValidProject(projectRootPath: string, projectType: string): boolean {
    return this.isAngularCLIProject(projectRootPath, projectType) || this.isAngularProject(projectType) || this.isKarmaProject(projectType);
  }

  public isAngularCLIProject(projectRootPath: string, projectType: string) {
    const angularJsonPath = path.join(projectRootPath, "angular.json");
    const angularCliJsonPath = path.join(projectRootPath, ".angular-cli.json");

    return projectType == "AngularCLI" && (this.fileHelper.doesFileExists(angularJsonPath) || this.fileHelper.doesFileExists(angularCliJsonPath));
  }

  private isAngularProject(projectType: string) {
    return projectType == "Angular";
  }

  private isKarmaProject(projectType: string) {
    return projectType == "Karma";
  }
}
