import { AngularProcessConfigurator } from "../../../src/core/angular/angular-process-configurator";
import { FileHelper } from "../../../src/core/integration/file-helper";

jest.mock("../../../src/core/integration/file-helper");

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
});

let fileHelper: jest.Mocked<FileHelper>;

test("createProcessOptions should return a valid SpawnOptions", () => {
  // Arrange
  fileHelper.doesFileExists.mockReturnValue(true);
  const angularProcessConfigurator = new AngularProcessConfigurator(fileHelper);
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

test("createAngularCommandAndArguments should return a valid set of commandLine command and cliArgs", () => {
  // Arrange
  fileHelper.doesFileExists.mockReturnValue(true);
  const angularProcessConfigurator = new AngularProcessConfigurator(fileHelper);
  const projectName = "projectName";
  const baseKarmaConfigFile = "baseKarmaConfigFile";
  const workspaceRootPath = "workspaceRootPath";

  // Act
  const { cliCommand, cliArgs } = angularProcessConfigurator.createProcessCommandAndArguments(projectName, baseKarmaConfigFile, workspaceRootPath);

  // Assert
  expect(cliCommand === "npx" || "ng").toBeTruthy();
  expect(cliArgs.includes(projectName)).toBeTruthy();
  expect(cliArgs.includes(`--karma-config="${baseKarmaConfigFile}"`)).toBeTruthy();
});
