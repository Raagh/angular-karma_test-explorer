const fs = require("fs");
import path = require("path");
import { when } from "jest-when";
import { KarmaHelper } from "../../../src/core/karma/karma-helper";

jest.mock("fs");

test("isKarmaBasedProject should return true if angular.json is present", () => {
  // Arrange
  const pathJson = path.join("", "angular.json");
  const karmaHelper = new KarmaHelper();
  when(fs.existsSync)
    .calledWith(pathJson)
    .mockReturnValue(true);

  // Act
  const result = karmaHelper.isKarmaBasedProject("");

  // Assert
  expect(result).toBeTruthy();
});

test("isKarmaBasedProject should return true if .angular-cli.json is present", () => {
  // Arrange
  const pathCliJson = path.join("", ".angular-cli.json");
  const karmaHelper = new KarmaHelper();
  when(fs.existsSync)
    .calledWith(pathCliJson)
    .mockReturnValue(true);

  // Act
  const result = karmaHelper.isKarmaBasedProject("");

  // Assert
  expect(result).toBeTruthy();
});

test("isKarmaBasedProject should return false if no angular json file is present", () => {
  // Arrange
  const karmaHelper = new KarmaHelper();
  fs.existsSync.mockReturnValue(false);

  // Act
  const result = karmaHelper.isKarmaBasedProject("");

  // Assert
  expect(result).toBeFalsy();
});
