jest.mock("./../../src/workers/test-explorer/logger");
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

  // Assert
  const projectLevelSuite = loadedTestProject.children[0] as TestSuiteInfo;
  const appComponentLevelSuite = projectLevelSuite.children[0] as TestSuiteInfo
  expect(appComponentLevelSuite.children.length).toBeGreaterThan(1);
}, 740000);

test("should re load tests from an already loaded test project", async () => {
  // Arrange
  const eventEmitter = { fire() {} } as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;
  const testExplorer = new AngularTestExplorer(testProjectPath, baseKarmaConfigPath, eventEmitter);

  // Act
  await testExplorer.loadTests();
  const loadedTestProject = await testExplorer.loadTests();

  // Assert 
  const projectLevelSuite = loadedTestProject.children[0] as TestSuiteInfo;
  const appComponentLevelSuite = projectLevelSuite.children[0] as TestSuiteInfo
  expect(appComponentLevelSuite.children.length).toBeGreaterThan(1);
}, 740000);
