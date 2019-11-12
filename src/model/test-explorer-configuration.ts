import path = require("path");

export class TestExplorerConfiguration {
  public constructor(config: any, workspaceVSCODEPath: string) {
    const workspacePath = workspaceVSCODEPath.replace(/^\/([A-Za-z]):\//, "$1:/");
    const projectRootPath = config.get("projectRootPath") as string;
    const karmaConfFilePath = config.get("karmaConfFilePath") as string;
    this.defaultAngularProjectName = config.get("defaultAngularProjectName") as string;
    this.defaultSocketConnectionPort = config.get("defaultSocketConnectionPort") as number;
    this.projectRootPath = path.join(workspacePath, projectRootPath);
    this.userKarmaConfFilePath = path.join(workspacePath, projectRootPath, karmaConfFilePath);
    this.baseKarmaConfFilePath = path.join(__dirname, "..", "config", "test-explorer-karma.conf.js");
    this.projectType = config.get("projectType") as string;
    this.angularProcessCommand = config.get("angularProcessCommand") as string;
    this.angularProcessArguments = config.get("angularProcessArguments") as string[];
  }

  public defaultAngularProjectName: string;
  public defaultSocketConnectionPort: number;
  public projectRootPath: string;
  public userKarmaConfFilePath: string;
  public baseKarmaConfFilePath: string;
  public projectType: string;
  public angularProcessCommand: string;
  public angularProcessArguments: string[];
}
