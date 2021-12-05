# Angular/Karma Test Explorer for Visual Studio Code

The `Angular/Karma Test Explorer` extension allows you to run or debug your Angular or Karma tests with the
[Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) extension on Visual Studio Code.

![Example run tests](img/img-running-tests-readme.png)

[![Build Status](https://dev.azure.com/raagh/angular-karma-test-explorer/_apis/build/status/angular-karma-test-explorer-CI?branchName=master)](https://dev.azure.com/raagh/angular-karma-test-explorer/_build/latest?definitionId=2?branchName=master)


## THIS EXTENSION IS NO LONGER BEING UPDATED, PLEASE CONSIDER USING [THIS](https://marketplace.visualstudio.com/items?itemName=lucono.karma-test-explorer)

## Features

- See all angular tests in the side bar without running them.
- Reload tests manually by the reload button in the UI.
- Run all tests together, run set of tests, run single test and see results in the UI.
- Shows a failed test's log when the test is selected in the explorer.
- Block during test execution.
- Debug tests (Please read the [special notes](DOCUMENTATION.md) about this feature).
- Cancel current run (Please read the [special notes](DOCUMENTATION.md) about this feature).
- Lets you choose test suites or individual tests in the explorer that should be run automatically after each file change.
- Supports Angular CLI projects.
- Supports standalone karma (specify "Karma" as projectType).
- Supports non CLI Angular projects (specify "Angular" as projectType).
- Supports multi-root workspaces(only one angular app per workspace).
- Adds CodeLenses to your test files for starting and debugging tests.
- Adds Gutter decorations to your test files showing the tests' state.
- Adds line decorations to the source line where a test failed.
- Loads values from user karma.conf.js (some get removed to make the explorer work correctly).
- Detects configuration changes and reload tests automatically.
- Allows configuration for different type of workflows: Angular project path, project type, karma.conf path, default project name for multiple projects inside one root.
- Forwards the console output from Karma to a VS Code output channel(Test Explorer Logs).

## How to use it?

- Check the [official documentation for this extension](DOCUMENTATION.md) to know the proper configuration for your specific scenario.

## Planned features

- Detect file changes(workspace, new test definitions) and reload tests automatically.

## What about bugs and fixes?

- If something goes wrong you will see error logs on vscode `Test Explorer Logs` output channel.
- If you find a bug or think that a feature is missing and is not in the backlog please report it using the appropiate github issue template.
- If you wanna help out please read the [contribution guidelines for this project](.github/CONTRIBUTING.md).
- If you have any urgent question you might wanna check our [Gitter Channel](https://gitter.im/Angular-Karma-Test-Explorer/Bugs) for a direct chat with me or other people using the extension.

## Do you like my work? Then consider [becoming a Patron!](https://www.patreon.com/bePatron?u=23135460)
