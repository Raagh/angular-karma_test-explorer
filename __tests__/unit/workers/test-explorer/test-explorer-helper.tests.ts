import { TestExplorerHelper } from "../../../../src/core/test-explorer/test-explorer-helper";

test("groupBy should return grouped values by the used key", () => {
  // Arrange
  const helper = new TestExplorerHelper();
  const mappedValues = [{ property: "value" }, { property: "value" }];
  const expectedResult = { value: [{ property: "value" }, { property: "value" }] };
  const result = helper.groupBy(mappedValues, "property");

  expect(result).toEqual(expectedResult);
});

test("TestExplorerHelper removeElementsFromArrayWithoutModifyingIt should return an array without the pass values if they re text", () => {
  const helper = new TestExplorerHelper();
  const completeSetOfValues = ["kjhtml", "progress", "dot"];
  const removeValues = ["kjhtml", "dot"];
  const expectedResults = ["progress"];

  const result = helper.removeElementsFromArrayWithoutModifyingIt(completeSetOfValues, removeValues);

  expect(result).toEqual(expectedResults);
});

test("TestExplorerHelper removeElementsFromArrayWithoutModifyingIt should return an array without the pass values if they re objects", () => {
  const helper = new TestExplorerHelper();
  const completeSetOfValues = [{ kjhtml: "43" }, { progress: "2" }, { dot: "3" }];
  const removeValues = [{ kjhtml: "43" }, { dot: "3" }];
  const expectedResults = [{ progress: "2" }];

  const result = helper.removeElementsFromArrayWithoutModifyingIt(completeSetOfValues, removeValues);

  expect(result).toEqual(expectedResults);
});
