import { KarmaProcessConfigurator } from "../../../src/core/karma/karma-process-configurator";

test("createProcessOptions should return a valid SpawnOptions", () => {
  // Arrange
  const angularProcessConfigurator = new KarmaProcessConfigurator();
  const projectRootPath = "projectRootPath";
  const userKarmaConfPath = "userKarmaConfPath";
  const defaultSocketPort = 2000;

  // Act
  const options = angularProcessConfigurator.createProcessOptions(projectRootPath, userKarmaConfPath, defaultSocketPort);

  // Assert
  expect(options.cwd).toBe(projectRootPath);
  expect(options.env && options.env.userKarmaConfigPath).toBe(userKarmaConfPath);
  expect(options.env && options.env.defaultSocketPort).toBe(defaultSocketPort.toString());
});

test("createProcessCommandAndArguments should return a valid set of commandLine command and cliArgs", () => {
  // Arrange
  const angularProcessConfigurator = new KarmaProcessConfigurator();
  const baseKarmaConfigFile = "baseKarmaConfigFile";

  // Act
  const { command, processArguments } = angularProcessConfigurator.createProcessCommandAndArguments(baseKarmaConfigFile);

  // Assert
  expect(command == "npx").toBeTruthy();
  expect(processArguments.includes(baseKarmaConfigFile)).toBeTruthy();
});
