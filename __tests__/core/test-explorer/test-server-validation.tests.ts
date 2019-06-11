const fs = require("fs");
import path = require("path");
import { when } from "jest-when";
import { TestServerValidation } from "../../../src/core/test-server/test-server-validation";

jest.mock("fs");

test("isAngularCliProject should return true if angular.json is present", () => {
  // Arrange
  const pathJson = path.join("", "angular.json");
  const testServerValidation = new TestServerValidation();
  when(fs.existsSync)
    .calledWith(pathJson)
    .mockReturnValue(true);

  // Act
  const result = testServerValidation.isAngularCLIProject("", "AngularCLI");

  // Assert
  expect(result).toBeTruthy();
});

test("isAngularCliProject should return true if .angular-cli.json is present", () => {
  // Arrange
  const pathCliJson = path.join("", ".angular-cli.json");
  const testServerValidation = new TestServerValidation();
  when(fs.existsSync)
    .calledWith(pathCliJson)
    .mockReturnValue(true);

  // Act
  const result = testServerValidation.isAngularCLIProject("", "AngularCLI");

  // Assert
  expect(result).toBeTruthy();
});

test("isAngularCliProject should return false if no angular json file is present", () => {
  // Arrange
  const testServerValidation = new TestServerValidation();
  fs.existsSync.mockReturnValue(false);

  // Act
  const result = testServerValidation.isAngularCLIProject("", "AngularCLI");

  // Assert
  expect(result).toBeFalsy();
});
