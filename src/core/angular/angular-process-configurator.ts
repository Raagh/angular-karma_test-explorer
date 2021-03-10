import { SpawnOptions } from "child_process";
import { FileHelper } from "../integration/file-helper";
import { window } from "vscode";

export class AngularProcessConfigurator {
  public constructor(private readonly fileHelper: FileHelper) {}

  public createProcessOptions(projectRootPath: string, userKarmaConfigPath: string, defaultSocketPort: number) {
    const testExplorerEnvironment = Object.create(process.env);
    testExplorerEnvironment.userKarmaConfigPath = userKarmaConfigPath;
    testExplorerEnvironment.defaultSocketPort = defaultSocketPort;
    const options = {
      cwd: projectRootPath,
      shell: true,
      env: testExplorerEnvironment,
    } as SpawnOptions;
    return options;
  }

  public createProcessCommandAndArguments(
    projectName: string,
    baseKarmaConfigFilePath: string,
    workspaceRootPath: string,
    angularProcessCommand: string,
    angularProcessArguments: string[]
  ) {
    const path = require("path");
    const resolveGlobal = require("resolve-global");
    const isAngularInstalledGlobally = resolveGlobal.silent("@angular/cli") != null;
    const isAngularInstalledLocally = this.fileHelper.doesFileExists(path.join(workspaceRootPath, "node_modules", "@angular", "cli", "bin", "ng"));

    if (angularProcessCommand) {
      return {
        cliCommand: angularProcessCommand,
        cliArgs: [projectName, `--karma-config="${baseKarmaConfigFilePath}"`, "--progress=false", ...angularProcessArguments],
      };
    }

    const commonArgs = ["test", projectName, `--karma-config="${baseKarmaConfigFilePath}"`, "--progress=false", ...angularProcessArguments];
    let cliCommand: string = "";
    let cliArgs: string[] = [];

    if (isAngularInstalledGlobally) {
      cliArgs = commonArgs;
      cliCommand = "ng";
    } else if (isAngularInstalledLocally) {
      cliArgs = ["ng", ...commonArgs];
      cliCommand = "npx";
    } else {
      const error = "@angular/cli is not installed, install it and restart vscode";
      window.showErrorMessage(error);
      throw new Error(error);
    }

    return { cliCommand, cliArgs };
  }
}
