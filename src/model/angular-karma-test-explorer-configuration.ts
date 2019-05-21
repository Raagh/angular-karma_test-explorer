import * as vscode from "vscode";
export class AngularKarmaTestExplorerConfiguration {
  public constructor(workspace: vscode.WorkspaceFolder) {
    const config = vscode.workspace.getConfiguration("angularKarmaTestExplorer", workspace.uri);
    this.defaultAngularProjectName = config.get("defaultAngularProjectName") as string;
    this.defaultSocketConnectionPort = config.get("defaultSocketConnectionPort") as number;
    this.angularProjectRootPath = config.get("angularProjectRootPath") as string;
    this.karmaConfFilePath = config.get("karmaConfFilePath") as string;
    this.isDebugModeEnabled = config.get("debugMode") as boolean;
  }

  public defaultAngularProjectName: string;
  public defaultSocketConnectionPort: number;
  public angularProjectRootPath: string;
  public karmaConfFilePath: string;
  public isDebugModeEnabled: boolean;
}
