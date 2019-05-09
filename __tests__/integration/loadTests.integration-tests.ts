jest.mock("./../../src/core/test-explorer/logger");
import { AngularTestExplorer } from "../../src/angular-test-explorer";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent, TestSuiteInfo } from "vscode-test-adapter-api";
import * as vscode from "vscode";
import path = require("path");

const testProjectPath = path.join(__dirname, "test-project");
const baseKarmaConfigPath = path.join(__dirname, "..", "..", "out", "config", "test-explorer-karma.conf.js");
const eventEmitter = { fire() {} } as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;
const channel = { appendLine() {}, name: "", append() {}, show() {}, clear() {}, hide() {}, dispose() {} } as vscode.OutputChannel;

test("should successfully load tests from a test project", async () => {
  // Arrange
  const testExplorer = new AngularTestExplorer(testProjectPath, baseKarmaConfigPath, eventEmitter, channel, false);

  // Acts
  const loadedTestProject = await testExplorer.loadTests("", 9999);

  // Assert
  const appComponentLevelSuite = loadedTestProject.children[0] as TestSuiteInfo;
  expect(appComponentLevelSuite.children.length).toBeGreaterThan(1);
}, 740000);

// test("should successfully reload tests from an already loaded test project", async () => {
//   // Arrange
//   const testExplorer = new AngularTestExplorer(testProjectPath, baseKarmaConfigPath, eventEmitter, channel, false);

//   // Acts
//   await testExplorer.loadTests("", 9999);
//   const loadedTestProject = await testExplorer.loadTests("", 9999);

//   // Assert
//   const projectLevelSuite = loadedTestProject.children[0] as TestSuiteInfo;
//   const appComponentLevelSuite = projectLevelSuite.children[0] as TestSuiteInfo
//   expect(appComponentLevelSuite.children.length).toBeGreaterThan(1);
// }, 740000);
