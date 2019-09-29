## Getting started

- Open the project folder.
- Install the extension.
- Restart VS Code and open the Test view.
- Run your tests using the ![Run](img/run.png) icon.
- Debug tests by setting breakpoints in your code and press the ![Debug](img/debug.png) icon to start debugging.
- If a test failed click on it and you will see the fail information on vscode `Test Explorer` output channel, or gutter decorations inside the spec file.

## Configuration

List of currently used properties:

| Property                                               | Description                                                                                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `angularKarmaTestExplorer.defaultAngularProjectName`   | (Only for AngularCLI projects) Set the default angular project to be tested, if this is is null default project in angular.json will be loaded |
| `angularKarmaTestExplorer.defaultSocketConnectionPort` | This is the port that will be used to connect Karma with the test explorer                                                                     |
| `angularKarmaTestExplorer.debugMode`                   | This will enable debug mode, which will create a new output channel with detailed logs                                                         |
| `angularKarmaTestExplorer.projectRootPath`             | The working directory where the project is located (relative to the root folder)                                                               |
| `angularKarmaTestExplorer.karmaConfFilePath`           | The path where the karma.conf.js is located (relative to the angular project folder)                                                           |
| `angularKarmaTestExplorer.projectType`                 | Setup the type of project you re using('AngularCLI', 'Angular' or 'Karma'). Default value is AngularCLI                                        |
| `angularKarmaTestExplorer.angularProcessCommand`       | If you run angular with a specific configuration in your ng test command you can setup it here                                                 |

Port 9999 is used as default for connecting the vscode instance and the karma instance. If you want to use a different port you can change it by
setting the following property:

| Property                                               | Description                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `angularKarmaTestExplorer.defaultSocketConnectionPort` | This is the port that will be used to connect Karma with the test explorer |

If you have multiple instances of vscode open make sure to setup a different port for each instance.

## Advanced Configuration

In some cases your specific projects needs to run on higher node memory to work, people in this cases generally run this command to do `ng test => node --max_old_space_size=4000 ./node_modules/@angular/cli/bin/ng test`
is that is your case you can use the property

| Property                                         | Example                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| `angularKarmaTestExplorer.angularProcessCommand` | `node --max_old_space_size=4000 ./node_modules/@angular/cli/bin/ng test` |

If you want to open a folder were the project is just one folder inside your root (for example if you open a root folder and inside you have one folder for the Angular app and another for the API).
You need to let the `Test Explorer` where the Angular app is located inside that root by adding the following extra configuration independent of the type of project:

| Property                                   | Description                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `angularKarmaTestExplorer.projectRootPath` | The working directory where the project is located (relative to the root folder) |

For `ANGULAR CLI` projects basic configuration is set as `DEFAULT`. Just open the folder and everything should start normally.

For `ANGULAR NON CLI` projects you need to setup the following configuration:

| Property                                     | Description                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `angularKarmaTestExplorer.karmaConfFilePath` | The path where the karma.conf.js is located (relative to the angular project folder) |
| `angularKarmaTestExplorer.projectType`       | 'Angular'                                                                            |

For `KARMA` projects you need to setup the following configuration:

| Property                                     | Description                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `angularKarmaTestExplorer.karmaConfFilePath` | The path where the karma.conf.js is located (relative to the angular project folder) |
| `angularKarmaTestExplorer.projectType`       | 'Karma'                                                                              |

---

## SPECIAL NOTES

### "CANCEL CURRENT RUN" FEATURE

This is a major hack, karma and angular dont support a way to stop current run without
killing the test server, so when you click the cancel button what it really happens is that the test server is killed
and starts again, this involves resources and time but ATM there is no other way of doing it, use at your own risk.

### "DEBUG TESTS" FEATURE

Unfortunately because of limitations inside KarmaTestRunner the debugging session cannot be stopped automatically without restarting the entire karma test enviroment, since this is a very slow process it was decided that the user has to stop the debugging session in VSCODE manually before continuing running tests. If this is not done all consequent runs will be debugged .
