import { AngularProjectConfigLoader } from "../core/angular/angular-project-config-loader";
import { FileHelper } from "../core/integration/file-helper";
import * as vscode from "vscode";
import { Adapter } from "../adapter";
import { TestServerValidation } from "../core/test-server/test-server-validation";
import { ProjectType } from "../model/project-type.enum";

export class UIExtensionMethods {
  public constructor() {}

  public isAngularCLIProject(testExplorerAdapter: Adapter, projectType: ProjectType): boolean {
    const karmaHelper = new TestServerValidation();
    const isAngularCLIProject =
      karmaHelper.isAngularCliProject(testExplorerAdapter.config.angularProjectPath) && projectType == ProjectType.AngularCLI;

    if (isAngularCLIProject) {
      vscode.commands.executeCommand("setContext", "isAngularEnviroment", true);
      return true;
    } else {
      vscode.commands.executeCommand("setContext", "isAngularEnviroment", false);
      return false;
    }
  }

  public async createSelectProjectQuickPick(testExplorerAdapter: Adapter): Promise<void> {
    const angularProjectConfigLoader = new AngularProjectConfigLoader(new FileHelper());
    const loadedProjects = angularProjectConfigLoader.getAllAngularProjectsConfig(testExplorerAdapter.config.angularProjectPath);
    const selectedProject = await vscode.window.showQuickPick(loadedProjects.map(x => x.name), {
      placeHolder: "Select project",
    });

    await testExplorerAdapter.load(selectedProject);
  }
}
