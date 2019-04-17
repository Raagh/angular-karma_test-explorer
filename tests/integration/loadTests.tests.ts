import { AngularTestExplorer } from "../../src/angular-test-explorer";
import { ExecOptions, execSync } from "child_process";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent, TestSuiteInfo } from "vscode-test-adapter-api";
import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");

const testProjectPath = path.join(__dirname, "test-project");
const baseKarmaConfigPath = path.join(__dirname, "..", "..", "out", "config", "test-explorer-karma.conf.js");

beforeAll(() => {
  if (!fs.existsSync(testProjectPath)) {
    execSync("npx ng new test-project --defaults=true", { cwd: testProjectPath } as ExecOptions);
  }
});

test("should successfully load tests from a test project", async () => {
  // Arrange
  const eventEmitter = { fire() {} } as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;
  const testExplorer = new AngularTestExplorer(testProjectPath, baseKarmaConfigPath, eventEmitter);

  // Act
  const loadedTestProject = await testExplorer.loadTests();
  const loadedTests = loadedTestProject.children[0] as TestSuiteInfo;

  // Assert
  expect(loadedTests.children).toBeGreaterThanOrEqual(1);
}, 50000);
