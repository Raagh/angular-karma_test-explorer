import { AngularProject } from './../../../../src/model/angular-project';
import { FileHelper } from "./../../../../src/workers/test-explorer/file-helper";
import { AngularProjectConfigLoader } from "../../../../src/workers/karma/angular-project-config-loader";
import * as angularJsonMock from "../../../../__mocks__/angular.json.mock";
import * as angularCliJsonMock from "../../../../__mocks__/angular-cli.json.mock";
import { when } from "jest-when";

jest.mock("./../../../../src/workers/test-explorer/file-helper");

let fileHelper: jest.Mocked<FileHelper>;

beforeAll(() => {
  fileHelper = new (FileHelper as any)() as any;
});

test("loadTestsFromDefaultProject should throw an error if angular.json is not found", async () => {
  // Arrange
  const angularProjectConfigLoader = new AngularProjectConfigLoader("", fileHelper);

  // Act
  try {
    await angularProjectConfigLoader.load();
  } catch (error) {
    // Assert
    expect(error.toString()).toBe("Error: No angular.json or angular-cli.json file found in root path.");
  }
});

test("loadTestsFromDefaultProject return valid AngularProject from default project if angular.json is present", async () => {
  // Arrange
  when((fileHelper.doesFileExists as any) as jest.Mock<boolean, string[]>)
    .calledWith("angular.json")
    .mockReturnValue(true)
    .calledWith(".angular-cli.json")
    .mockReturnValue(false);
  fileHelper.readJSONFile.mockReturnValue(angularJsonMock.mock);
  const angularProjectConfigLoader = new AngularProjectConfigLoader("", fileHelper);

  // Act
  const result = await angularProjectConfigLoader.load();

  // Assert
	verifyExpectedResults(result);
});

test("loadTestsFromDefaultProject return valid AngularProject from default project if angular-cli.json is present", async () => {
  // Arrange
  when((fileHelper.doesFileExists as any) as jest.Mock<boolean, string[]>)
    .calledWith("angular.json")
    .mockReturnValue(false)
    .calledWith(".angular-cli.json")
    .mockReturnValue(true);
  fileHelper.readJSONFile.mockReturnValue(angularCliJsonMock.mock);
  const angularProjectConfigLoader = new AngularProjectConfigLoader("", fileHelper);

  // Act
  const result = await angularProjectConfigLoader.load();

	// Assert
	verifyExpectedResults(result);
});

const verifyExpectedResults = (result: AngularProject) => {
	expect(result).not.toBeUndefined();
	expect(result.name).toBe("test-project");
	expect(result.isAngularDefaultProject).toBe(true);
}
