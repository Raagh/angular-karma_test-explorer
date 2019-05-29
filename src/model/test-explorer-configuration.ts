import path = require("path");
export class TestExplorerConfiguration {
  public constructor(config: any, workspaceVSCODEPath: string) {
    const workspacePath = workspaceVSCODEPath.replace(/^\/([a-z]):\//, "$1:/");
    const angularProjectRootPath = config.get("angularProjectRootPath") as string;
    const karmaConfFilePath = config.get("karmaConfFilePath") as string;
    this.defaultAngularProjectName = config.get("defaultAngularProjectName") as string;
    this.defaultSocketConnectionPort = config.get("defaultSocketConnectionPort") as number;
    this.angularProjectPath = path.join(workspacePath, angularProjectRootPath);
    this.userKarmaConfFilePath = path.join(workspacePath, angularProjectRootPath, karmaConfFilePath);
    this.baseKarmaConfFilePath = path.join(__dirname, "..", "config", "test-explorer-karma.conf.js");
  }

  public defaultAngularProjectName: string;
  public defaultSocketConnectionPort: number;
  public angularProjectPath: string;
  public userKarmaConfFilePath: string;
  public baseKarmaConfFilePath: string;
}
