import path = require("path");
import { window } from "vscode";

export class KarmaHelper {
  public constructor() {}

  public isKarmaBasedProject(projectRootPath: string) {
    const fs = require("fs");
    if (fs.existsSync(path.join(projectRootPath, ".angular-cli.json"))) {
      window.showErrorMessage("The Angular version you re using is not supported, please update to Angular 6+");
    }

    return fs.existsSync(path.join(projectRootPath, "angular.json"));
  }
}
