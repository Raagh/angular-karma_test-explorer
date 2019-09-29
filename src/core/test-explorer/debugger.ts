import { Logger } from "../shared/logger";
import * as vscode from "vscode";

export class Debugger {
  public constructor(private readonly logger: Logger) {}

  public async manageVSCodeDebuggingSession(workspace: any): Promise<void> {
    if (vscode.debug.activeDebugSession) {
      return;
    }

    let currentSession: vscode.DebugSession | undefined;

    currentSession = await this.startDebuggingSession(workspace, currentSession);
    if (!currentSession) {
      this.logger.error("No active debug session - aborting");
      return;
    }

    const subscription = vscode.debug.onDidTerminateDebugSession(session => {
      if (currentSession !== session) {
        return;
      }
      this.logger.info("Debug session ended");
      subscription.dispose();
    });
  }

  private async startDebuggingSession(workspace: any, currentSession: vscode.DebugSession | undefined) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(workspace.uri);
    await vscode.debug.startDebugging(workspaceFolder, {
      name: "Debug tests",
      type: "chrome",
      request: "attach",
      port: 9222,
      sourceMaps: true,
      webRoot: "${workspaceRoot}",
      sourceMapPathOverrides: {
        "webpack:/*": "${webRoot}/*",
        "/./*": "${webRoot}/*",
        "/src/*": "${webRoot}/*",
        "/*": "*",
        "/./~/*": "${webRoot}/node_modules/*",
      },
    });
    // workaround for Microsoft/vscode#70125
    await new Promise(resolve => setImmediate(resolve));
    currentSession = vscode.debug.activeDebugSession;
    return currentSession;
  }
}
