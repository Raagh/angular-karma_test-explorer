import path = require("path");

export class KarmaHelper {
  public constructor() {}

  public isKarmaBasedProject(projectRootPath: string) {
    const fs = require("fs");
    const angularJsonPath = path.join(projectRootPath, "angular.json");
    const angularCliJsonPath = path.join(projectRootPath, ".angular-cli.json");

    return fs.existsSync(angularJsonPath) || fs.existsSync(angularCliJsonPath);
  }
}
