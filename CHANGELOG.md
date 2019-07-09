### Version 1.0.2

- Cancel current test run. 
**WARNING** 
This is a major hack, karma and angular dont support a way to stop current run without
killing the test server, so when you click the cancel button what it really happens is that the test server is killed
and starts again, this envolves resources and time but ATM there is no other way of doing it.

### Version 1.0.1

- Fix parsing bug if filePath of test is undefined.

### Version 1.0.0

- Add file gutter decorations.
- Add view source feature.
- Add line decorations where the test failed.
- Better errors messages in output channel.
- Rework tree implementation.
- Added extra unit tests to integration parts.

### Version 0.3.3

- Trying single build/release azure pipeline for correct uploading.

### Version 0.3.2

- Manual release till azure pipeline publish is verified.

### Version 0.3.1

- Fix Azure pipeline package problem on windows hosted system.

### Version 0.3.0

- Added support for standalone karma.
- Added support for Non CLI angular projects.
- Integrated CI/CD azure pipeline for all future builds.

### Version 0.2.3

- Refactor configuration properties.
- Added configuration properties for custom folder structure.
- Added support for multi-root workspaces (only one folder of the workspace can be an angular app).

### Version 0.2.2

- Kill all karma processes before starting a new one.
- Now users can config the root path of the Angular App relative to the workspace.

### Version 0.2.1

- Added select project button in UI for multiple project apps.
- Greatly improved unit testing.
- Dependencies refactoring.

### Version 0.2.0

- Added support for old angular-cli.json projects.
- Added initial support for multi-apps in a single repository (this should include hybrid apps and component libraries).
- Added configuration properties in vscode (socketDefaultPort, debugMode and defaultProjectName).
- Improved integration testing.
- Dependencies refactoring.

### Version 0.1.7

- Added independent output channel for logging. Thanks Sam David aka @future-pirate-king .

### Version 0.1.6

- Fixed a bug that was causing reload tests not working, cleaner exit of karma.

### Version 0.1.5

- Workaround for socket.io closing connection, for now we reload the testing enviroment.
- Error handling improved, user will get more information if something fails.
- Now we inform if the user is using an older version of AngularCLI.
- Cleanup logging.

### Version 0.1.4

- Test Explorer now supports multiple drive letters on windows.
- Unit testing improved.

### Version 0.1.3

- Enabled extra logging during preview phase.

### Version 0.1.2

- Fixed updated npm modules causing crash on MacOS/Linux.

### Version 0.1.1

- If @angular/cli is not installed global the test explorer would use the local dependencies.

### Version 0.1.0

- Initial release.
