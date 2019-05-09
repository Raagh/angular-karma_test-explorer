import * as vscode from "vscode";
import { TestHub, testExplorerExtensionId } from "vscode-test-adapter-api";
import { Log, TestAdapterRegistrar } from "vscode-test-adapter-util";
import { Adapter } from "./adapter";
import { OUTPUT_CHANNEL } from "./core/shared/logger";
import { UIExtensionMethods } from "./infrastructure/ui-extension-methods";

export async function activate(context: vscode.ExtensionContext) {
  const workspaceFolder = (vscode.workspace.workspaceFolders || [])[0];
  const channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL);

  // create a simple logger that can be configured with the configuration variables
  // `angularKarmaExplorer.logpanel` and `angularKarmaExplorer.logfile`
  const log = new Log("AngularKarmaExplorer", workspaceFolder, "AngularKarma Explorer Log");
  context.subscriptions.push(log);

  // get the Test Explorer extension
  const testExplorerExtension = vscode.extensions.getExtension<TestHub>(testExplorerExtensionId);
  if (log.enabled) {
    log.info(`Test Explorer ${testExplorerExtension ? "" : "not "}found`);
  }

  if (testExplorerExtension) {
    const testHub = testExplorerExtension.exports;

    const registerCommand = (command: string, callback: (...args: any[]) => any) => {
      context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    };

    const testExplorerAdapter = new Adapter(workspaceFolder, log, channel);

    registerCommand("angular-karma-test-explorer.select-project", async () => UIExtensionMethods.createSelectProjectQuickPick(testExplorerAdapter));

    // this will register an AngularKarmaTestAdapter for each WorkspaceFolder
    context.subscriptions.push(new TestAdapterRegistrar(testHub, workspaceFolder => testExplorerAdapter, log));
  }
}
