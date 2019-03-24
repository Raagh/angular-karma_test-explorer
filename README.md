# Angular/Karma Test Explorer for Visual Studio Code

This repository contains the implementation for `Angular/Karma Test Explorer` extension that works with the
[Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) extension.

![Example run tests](img/img-running-tests-readme.png =40%x40%)

## Features
- See all angular tests in the side bar without running them.
- Reload tests manually by the reload button in the UI.
- Run all tests together, run set of tests, run single test and see results in the UI.
- Loads values from user karma.conf.js (some get removed to make the explorer work correctly).
- Shows a failed test's log when the test is selected in the explorer.

## Getting started
- Install the extension.
- Restart VS Code and open the Test view.
- Run your tests using the ![Run](img/run.png) icon.
- If a test failed click on it and you will see the fail information on vscode `Test Explorer` output channel.

## Planned features
- Debug tests.
- Cancel current run.
- Block during test execution.
- Support standalone karma.
- Detect file changes(workspace, test definitions or configuration) and reload tests automatically.
- Lets you choose test suites or individual tests in the explorer that should be run automatically after each file change.
- Adds CodeLenses to your test files for starting and debugging tests.
- Adds Gutter decorations to your test files showing the tests' state.
- Adds line decorations to the source line where a test failed.
- Forwards the console output from Karma to a VS Code output channel.

## Disclaimer
This project is in early stages of development.
If you find a bug or think that a feature is missing and is not in the backlog please report it.
If you wanna help out please read the [Contribution guidelines for this project](CONTRIBUTING.md) file.
