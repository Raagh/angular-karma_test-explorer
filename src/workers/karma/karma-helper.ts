import path = require("path");

export class KarmaHelper {
  public constructor() {}

  public isKarmaBasedProject(projectRootPath: string) {
    const fs = require("fs");
    return fs.existsSync(path.join(projectRootPath, "angular.json"));
  }
}
