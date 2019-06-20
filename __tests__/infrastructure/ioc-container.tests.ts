import { IOCContainer } from "./../../src/infrastructure/ioc-container";
import * as vscode from "vscode";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import { ProjectType } from "../../src/model/enums/project-type.enum";

test("registerTestExplorerDependencies should return a valid AngularKarmaTestExplorer instance", () => {
  // Arrange
  const iocContainer = new IOCContainer();
  const eventEmitter = {} as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;

  // Act
  const angularKarmaTestExplorer = iocContainer.registerTestExplorerDependencies(
    eventEmitter,
    {} as vscode.OutputChannel,
    true,
    ProjectType.AngularCLI
  );

  // Assert
  expect(angularKarmaTestExplorer).not.toBeUndefined();
});
