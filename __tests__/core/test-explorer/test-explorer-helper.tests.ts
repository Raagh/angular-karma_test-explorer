import { TestExplorerHelper } from "../../../src/core/test-explorer/test-explorer-helper";

test("groupBy should return grouped values by the used key", () => {
  // Arrange
  const helper = new TestExplorerHelper();
  const mappedValues = [{ property: "value" }, { property: "value" }];
  const expectedResult = { value: [{ property: "value" }, { property: "value" }] };

  // Act
  const result = helper.groupBy(mappedValues, "property");

  // Assert
  expect(result).toEqual(expectedResult);
});

test("removeElementsFromArrayWithoutModifyingIt should return an array without the pass values if they re text", () => {
  // Arrange
  const helper = new TestExplorerHelper();
  const completeSetOfValues = ["kjhtml", "progress", "dot"];
  const removeValues = ["kjhtml", "dot"];
  const expectedResults = ["progress"];

  // Act
  const result = helper.removeElementsFromArrayWithoutModifyingIt(completeSetOfValues, removeValues);

  // Assert
  expect(result).toEqual(expectedResults);
});

test("removeElementsFromArrayWithoutModifyingIt should return an array without the pass values if they re objects", () => {
  // Arrange
  const helper = new TestExplorerHelper();
  const completeSetOfValues = [{ kjhtml: "43" }, { progress: "2" }, { dot: "3" }];
  const removeValues = [{ kjhtml: "43" }, { dot: "3" }];
  const expectedResults = [{ progress: "2" }];

  // Act
  const result = helper.removeElementsFromArrayWithoutModifyingIt(completeSetOfValues, removeValues);

  // Assert
  expect(result).toEqual(expectedResults);
});

test("removeElementsFromArrayWithoutModifyingIt should return an empty array if we pass an undefined set of values", () => {
  // Arrange
  const helper = new TestExplorerHelper();

  // Act
  const result = helper.removeElementsFromArrayWithoutModifyingIt(undefined, undefined);

  // Assert
  expect(result).toEqual([]);
});

test("removeElementsFromArrayWithoutModifyingIt should return an array without the pass value if its only one value", () => {
  // Arrange
  const helper = new TestExplorerHelper();
  const completeSetOfValues = ["43", "2", "3"];
  const removeValues = "43";
  const expectedResults = ["2", "3"];

  // Act
  const result = helper.removeElementsFromArrayWithoutModifyingIt(completeSetOfValues, removeValues);

  // Assert
  expect(result).toEqual(expectedResults);
});
