import { TestServerValidation } from "../../../src/core/test-server/test-server-validation";
import { FileHelper } from "../../../src/core/integration/file-helper";

jest.mock("../../../src/core/integration/file-helper");

let fileHelper: jest.Mocked<FileHelper>;

beforeEach(() => {
  fileHelper = new (FileHelper as any)() as any;
});

test("isAngularCliProject should return true if angular.json is present", () => {
  // Arrange
  fileHelper.doesFileExists.mockReturnValue(true);
  const testServerValidation = new TestServerValidation(fileHelper);

  // Act
  const result = testServerValidation.isAngularCLIProject("", "AngularCLI");

  // Assert
  expect(result).toBeTruthy();
});

test("isAngularCliProject should return true if .angular-cli.json is present", () => {
  // Arrange
  fileHelper.doesFileExists.mockReturnValueOnce(false);
  fileHelper.doesFileExists.mockReturnValueOnce(true);
  const testServerValidation = new TestServerValidation(fileHelper);

  // Act
  const result = testServerValidation.isAngularCLIProject("", "AngularCLI");

  // Assert
  expect(result).toBeTruthy();
});

test("isAngularCliProject should return false if no angular json file is present", () => {
  // Arrange
  const testServerValidation = new TestServerValidation(fileHelper);

  // Act
  const result = testServerValidation.isAngularCLIProject("", "AngularCLI");

  // Assert
  expect(result).toBeFalsy();
});
