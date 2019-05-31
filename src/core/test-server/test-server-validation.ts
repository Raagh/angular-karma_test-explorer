import path = require("path");

export class TestServerValidation {
  public constructor() {}

  public isAngularCliProject(projectRootPath: string) {
    const fs = require("fs");
    const angularJsonPath = path.join(projectRootPath, "angular.json");
    const angularCliJsonPath = path.join(projectRootPath, ".angular-cli.json");

    return fs.existsSync(angularJsonPath) || fs.existsSync(angularCliJsonPath);
  }
}
