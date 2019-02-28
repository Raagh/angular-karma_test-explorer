import { TestExplorerHelper } from "../../../src/workers/test-explorer/test-explorer-helper";

test("TestExplorerHelper GroupBy should return grouped values by the used key", () => {
  const helper = new TestExplorerHelper();
  const mappedValues = [{ property: "value" }, { property: "value" }];
  const expectedResult = { value: [{ property: "value" }, { property: "value" }] };
  const result = helper.groupBy(mappedValues, "property");

  expect(result).toEqual(expectedResult);
});
