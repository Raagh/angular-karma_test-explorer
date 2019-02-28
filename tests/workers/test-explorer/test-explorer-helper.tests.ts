import { TestExplorerHelper } from "../../../src/workers/test-explorer/test-explorer-helper";

test("TestExplorerHelper GroupBy should return grouped values by the used key", () => {
  const mappedValues = [{ property: "value" }, { property: "value" }];
  const expectedResult = { value: [{ property: "value" }, { property: "value" }] };
  const result = TestExplorerHelper.groupBy(mappedValues, "property");

  expect(result).toEqual(expectedResult);
});
