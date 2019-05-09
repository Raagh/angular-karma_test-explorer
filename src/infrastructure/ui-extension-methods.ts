import { AngularProjectConfigLoader } from "../core/angular/angular-project-config-loader";
import { FileHelper } from "../core/integration/file-helper";
import * as vscode from "vscode";
import { Adapter } from "../adapter";

export class UIExtensionMethods {
  public static async createSelectProjectQuickPick(testExplorerAdapter: Adapter): Promise<void> {
    const angularProjectConfigLoader = new AngularProjectConfigLoader(testExplorerAdapter.workspaceRootPath, new FileHelper());
    const loadedProjects = angularProjectConfigLoader.getAllAngularProjectsConfig(testExplorerAdapter.workspaceRootPath);
    const selectedProject = await vscode.window.showQuickPick(loadedProjects.map(x => x.name), {
      placeHolder: "Select project",
    });

    await testExplorerAdapter.load(selectedProject);
  }
}
