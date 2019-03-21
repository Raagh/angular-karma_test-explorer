# Angular/Karma Test Explorer for Visual Studio Code

This repository contains the implementation for `Angular/Karma Test Explorer` extension that works with the
[Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) extension.

<img src="./img/img-running-tests-readme.png" height="40%" width="40%">

## Working implementation

- See all angular tests in the side bar without running them.
- Reload tests manually by the reload button in the UI.
- Run all tests together, run set of tests, run single test and see results in the UI.
- Loads values from user karma.conf.js (some get removed to make the explorer work correctly)

## Completing the implementation

- Tons and tons of integration and unit tests.
- Supporting standalone karma.
- Implement `debugging` tests in vscode.
- Implement `cancel` (it should kill the child process that was started by `run` or `debug`).
- Watch the configuration for any changes that may affect the loading of test definitions and reload the test definitions if necessary.
- Watch the workspace for any changes to the test files and reload the test definitions if necessary.
- Watch the configuration for any changes that may affect the results of running the tests and emit an `autorun` event if necessary.
- Watch the workspace for any changes to the source files and emit an `autorun` event if necessary.
- Ensure that only one test run is active at a time.

## Disclaimer

This project is in early stages of development, the code may be changed at any moment.
If you find a bug or think that a feature is missing and is not in the backlog please report it.
