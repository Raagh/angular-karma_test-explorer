# Angular Test Explorer for Visual Studio Code

This repository contains the implementation for `Angular Test Explorer` extension that works with the
[Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) extension.

## Development

- install the [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) extension
- fork and clone this repository and open it in VS Code
- run `npm install`
- run `npm run watch` or start the watch Task in VS Code
- start the debugger

You should now see a second VS Code window, the Extension Development Host.
Open a folder in this window and click the "Test" icon in the Activity bar.
Now you should see the test suite in the side panel:

![The fake example test suite](img/img-tests.png =400x450)

## Working implementation

- Load tests without running them, every test in their corresponding suite
- Reload tests manually by the reload button in the UI.
- Run all tests together, run set of tests, run single test.
- Loads values from user karma.conf.js (some get removed to make the explorer work correctly)

## Completing the implementation

- Tons and Tons of integration tests
- Supporting standalone karma
- Implement the `debug()` method
- Implement the `cancel()` method (it should kill the child process that was started by `run()` or `debug()`)
- Watch the configuration for any changes that may affect the loading of test definitions and reload the test definitions if necessary
- Watch the workspace for any changes to the test files and reload the test definitions if necessary
- Watch the configuration for any changes that may affect the results of running the tests and emit an `autorun` event if necessary
- Watch the workspace for any changes to the source files and emit an `autorun` event if necessary
- Ensure that only one test run is active at a time

## Disclaimer

This project is in early stages of development, the code may be changed at any moment.
Karma outside of Angular will be included in the future.
