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

![The fake example test suite] (img/img-tests.png | width=306)

## Working implementation

- Load tests without running them, every test in their corresponding suite
- the implementation for running all tests is there but there is no call in `src/adapter.ts` as I am still trying
  to finish the loadTests implementation

## Completing the implementation

- start implementating unit tests in a TDD fashion
- loadTests implementation should work without running tests (by skipping them all)
- implement the `debug()` method
- implement the `cancel()` method (it should kill the child process that was started by `run()` or `debug()`)
- watch the configuration for any changes that may affect the loading of test definitions and reload the test definitions if necessary
- watch the workspace for any changes to the test files and reload the test definitions if necessary
- watch the configuration for any changes that may affect the results of running the tests and emit an `autorun` event if necessary
- watch the workspace for any changes to the source files and emit an `autorun` event if necessary
- ensure that only one test run is active at a time
- supporting standalone karma

## Disclaimer

This project is in early stages of development, the code may be changed at any moment. I am not considering
supporting karma outside of Angular at this stage, it will be included in the future.
