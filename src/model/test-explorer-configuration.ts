import * as vscode from "vscode";
import path = require("path");
export class TestExplorerConfiguration {
  public constructor(workspace: vscode.WorkspaceFolder) {
    const config = vscode.workspace.getConfiguration("angularKarmaTestExplorer", workspace.uri);
    const workspacePath = workspace.uri.path.replace(/^\/([a-z]):\//, "$1:/");
    const angularProjectRootPath = config.get("angularProjectRootPath") as string;
    const karmaConfFilePath = config.get("karmaConfFilePath") as string;
    this.defaultAngularProjectName = config.get("defaultAngularProjectName") as string;
    this.defaultSocketConnectionPort = config.get("defaultSocketConnectionPort") as number;
    this.angularProjectPath = path.join(workspacePath, angularProjectRootPath);
    this.userKarmaConfFilePath = path.join(workspacePath, angularProjectRootPath, karmaConfFilePath);
  }

  public defaultAngularProjectName: string;
  public defaultSocketConnectionPort: number;
  public angularProjectPath: string;
  public userKarmaConfFilePath: string;
}
