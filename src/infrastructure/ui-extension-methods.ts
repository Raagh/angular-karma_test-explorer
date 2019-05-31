import { AngularProjectConfigLoader } from "../core/angular/angular-project-config-loader";
import { FileHelper } from "../core/integration/file-helper";
import * as vscode from "vscode";
import { Adapter } from "../adapter";
import { TestServerValidation } from "../core/test-server/test-server-validation";

export class UIExtensionMethods {
  public constructor() {}

  public isKarmaBasedEnviroment(testExplorerAdapter: Adapter): boolean {
    const karmaHelper = new TestServerValidation();
    if (karmaHelper.isAngularCliProject(testExplorerAdapter.config.angularProjectPath)) {
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
