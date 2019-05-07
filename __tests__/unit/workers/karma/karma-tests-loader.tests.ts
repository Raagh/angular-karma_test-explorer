import { FileHelper } from "./../../../../src/workers/test-explorer/file-helper";
import { KarmaTestsLoader } from "./../../../../src/workers/karma/karma-tests-loader";
import { KarmaRunner } from "../../../../src/workers/karma/karma-runner";
import { AngularServer } from "../../../../src/workers/servers/angular-server";
import { TestExplorerHelper } from "../../../../src/workers/test-explorer/test-explorer-helper";
import * as angularJsonMock from "../../../../__mocks__/angular.json.mock";
import * as angularCliJsonMock from "../../../../__mocks__/angular-cli.json.mock";
import * as expectedTests from "../../../../__mocks__/expectedTests.mock";
import { when } from "jest-when";

jest.mock("../../../../src/workers/karma/karma-runner");
jest.mock("../../../../src/workers/servers/angular-server");
jest.mock("./../../../../src/workers/test-explorer/file-helper");

let karmaRunner: jest.Mocked<KarmaRunner>;
let angularServerMockedClass: jest.Mock<AngularServer>;
let fileHelper: jest.Mocked<FileHelper>;

beforeAll(() => {
  karmaRunner = new (KarmaRunner as any)() as any;
	angularServerMockedClass = <jest.Mock<AngularServer>>AngularServer;
  fileHelper = new (FileHelper as any)() as any;
});

test("loadTestsFromDefaultProject should throw an error if angular.json is not found", async () => {
  // Arrange
  const karmaTestsLoader = new KarmaTestsLoader(
    "",
    "",
    new angularServerMockedClass(),
    new TestExplorerHelper(),
    karmaRunner,
    fileHelper
  );

  // Act
  try {
    await karmaTestsLoader.loadTestsFromDefaultProject();
  } catch (error) {
    // Assert
    expect(error.toString()).toBe("Error: No angular.json or angular-cli.json file found in root path.");
  }
});

test("loadTestsFromDefaultProject return test from default project if angular.json is present", async () => {
	// Arrange
	when(fileHelper.doesFileExists as any as jest.Mock<boolean, string[]>)
		.calledWith("angular.json").mockReturnValue(true)
		.calledWith(".angular-cli.json").mockReturnValue(false);
	fileHelper.readJSONFile.mockReturnValue(angularJsonMock.mock);
	karmaRunner.loadTests.mockResolvedValue(expectedTests.mock)
  const karmaTestsLoader = new KarmaTestsLoader(
    "",
    "",
    new angularServerMockedClass(),
    new TestExplorerHelper(),
    karmaRunner,
    fileHelper
	);

  // Act
	const result = await karmaTestsLoader.loadTestsFromDefaultProject();

	// Assert
	expect(result.children).not.toBeUndefined();
});

test("loadTestsFromDefaultProject return test from default project if angular-cli.json is present", async () => {
	// Arrange
	when(fileHelper.doesFileExists as any as jest.Mock<boolean, string[]>)
		.calledWith("angular.json").mockReturnValue(false)
		.calledWith(".angular-cli.json").mockReturnValue(true);

	fileHelper.readJSONFile.mockReturnValue(angularCliJsonMock.mock);
	karmaRunner.loadTests.mockResolvedValue(expectedTests.mock)
  const karmaTestsLoader = new KarmaTestsLoader(
    "",
    "",
    new angularServerMockedClass(),
    new TestExplorerHelper(),
    karmaRunner,
    fileHelper
	);

  // Act
	const result = await karmaTestsLoader.loadTestsFromDefaultProject();

	// Assert
	expect(result.children).not.toBeUndefined();
});
