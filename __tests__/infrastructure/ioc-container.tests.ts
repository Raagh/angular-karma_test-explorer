import { IOCContainer } from "./../../src/infrastructure/ioc-container";
import * as vscode from "vscode";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import { ProjectType } from "../../src/model/enums/project-type.enum";

test("registerTestExplorerDependencies should return a valid AngularKarmaTestExplorer instance", () => {
  // Arrange
  const iocContainer = new IOCContainer({} as vscode.OutputChannel, true);
  const eventEmitter = {} as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;

  // Act
  const angularKarmaTestExplorer = iocContainer.registerTestExplorerDependencies(eventEmitter, ProjectType.AngularCLI);

  // Assert
  expect(angularKarmaTestExplorer).not.toBeUndefined();
});

test("registerDebuggerDependencies should return a valid Debugger instance", () => {
  // Arrange
  const iocContainer = new IOCContainer({} as vscode.OutputChannel, true);

  // Act
  const debuggerInstance = iocContainer.registerDebuggerDependencies();

  // Assert
  expect(debuggerInstance).not.toBeUndefined();
});
