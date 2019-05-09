import { SpecToTestSuiteMapper } from "../../../../src/core/test-explorer/spec-to-test-suite.mapper";
import * as expectedTests from "../../../../__mocks__/expectedTests.mock";
import { SpecResultGroupToSuites } from "./../../../../src/core/test-explorer/spec-result-groupby";

jest.mock("./../../../../src/core/test-explorer/spec-result-groupby");

const groupByResults = [
  { name: "suite1", suites: [], tests: ["test1"] },
  {
    name: "suite2",
    tests: ["test2"],
    suites: [{ name: "innersuite1", tests: ["test3", "test4"], suites: [{ name: "innersuite2", tests: ["test5"], suites: [] }] }],
  },
  { name: "suite3", tests: [], suites: [{ name: "innersuite3", tests: ["test6"], suites: [] }] },
] as any;

test("with correct grouped specs should return correctly mapped TestSuiteInfo", () => {
  // Arrange
  SpecResultGroupToSuites.prototype.group = jest.fn().mockReturnValue(groupByResults);
  const mapper = new SpecToTestSuiteMapper();

  /* savedSpecs dont really matter cause the values are grouped by the mocked dependency SpecResultGroupToSuites */
  const savedSpecs: any[] = [];

  const result = mapper.map(savedSpecs);

  expect(result).toEqual(expectedTests.mock);
});

test("with no grouped specs should return TestSuiteInfo with no children", () => {
  // Arrange
  SpecResultGroupToSuites.prototype.group = jest.fn().mockReturnValue([]);
  const mapper = new SpecToTestSuiteMapper();

  /* savedSpecs dont really matter cause the values are grouped by the mocked dependency SpecResultGroupToSuites */
  const savedSpecs: any[] = [];

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result).toHaveLength(0);
});
