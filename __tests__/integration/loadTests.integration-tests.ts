jest.mock("./../../src/workers/test-explorer/logger");
import { AngularTestExplorer } from "../../src/angular-test-explorer";
import { TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent, TestSuiteInfo } from "vscode-test-adapter-api";
import * as vscode from "vscode";
import path = require("path");

const testProjectPath = path.join(__dirname, "test-project");
const baseKarmaConfigPath = path.join(__dirname, "..", "..", "out", "config", "test-explorer-karma.conf.js");
const eventEmitter = { fire() {} } as vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>;
const channel = { appendLine() {} , name: "", append() {}, show() {}, clear() {}, hide(){}, dispose() {}  } as vscode.OutputChannel;

test("should successfully load tests from a test project", async () => {
  // Arrange
  const testExplorer = new AngularTestExplorer(testProjectPath, baseKarmaConfigPath, eventEmitter, channel);

  // Acts
  const loadedTestProject = await testExplorer.loadTests();

  // Assert
  const projectLevelSuite = loadedTestProject.children[0] as TestSuiteInfo;
  const appComponentLevelSuite = projectLevelSuite.children[0] as TestSuiteInfo
  expect(appComponentLevelSuite.children.length).toBeGreaterThan(1);
}, 740000);
