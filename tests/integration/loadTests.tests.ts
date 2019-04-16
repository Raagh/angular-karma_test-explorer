import { AngularTestExplorer } from "../../src/angular-test-explorer";
import { ExecOptions, execSync } from "child_process";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from "vscode-test-adapter-api";
import * as vscode from "vscode";
import path = require("path");

const testProjectPath = path.join(__dirname, "test-project");

beforeAll(() => {
	execSync("npx ng new test-project -css", { cwd: testProjectPath } as ExecOptions);
});

test("should successfully load tests from a test project", async () => {
  // Arrange
  const eventEmitter = { fire() {} } as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;
  const testExplorer = new AngularTestExplorer(testProjectPath, eventEmitter);

  // Act
  const loadedTests = await testExplorer.loadTests();

  // Assert
  expect(loadedTests.children).not.toBeLessThan(1);
});
