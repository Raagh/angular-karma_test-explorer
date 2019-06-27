import { FileHelper } from "./../../../src/core/integration/file-helper";
import * as fs from "fs";

jest.mock("fs");
const fakePath = "fakePath";

test("doesFileExists should return true if file is present", () => {
  // Arrange
  const fileHelper = new FileHelper();
  const existsSync = jest.spyOn(fs, "existsSync");
  existsSync.mockReturnValue(true);

  // Act
  const result = fileHelper.doesFileExists(fakePath);

  // Assert
  expect(result).toBeTruthy();
  expect(existsSync).toBeCalledWith(fakePath);
});

test("doesFileExists should return false if file is not present", () => {
  // Arrange
  const fileHelper = new FileHelper();
  const existsSync = jest.spyOn(fs, "existsSync");
  existsSync.mockReturnValue(false);

  // Act
  const result = fileHelper.doesFileExists(fakePath);

  // Assert
  expect(result).toBeFalsy();
  expect(existsSync).toBeCalledWith(fakePath);
});

test("readJSONFile should return a valid JSON if file is present", () => {
  // Arrange
  const fileHelper = new FileHelper();
  const readFileSync = jest.spyOn(fs, "readFileSync");
  readFileSync.mockReturnValue(`{"property": "value"}`);

  // Act
  const result = fileHelper.readJSONFile(fakePath);

  // Assert
  expect(result.property).toBe("value");
  expect(readFileSync).toBeCalledWith(fakePath, "utf8");
});
