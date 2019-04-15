import { SpecToTestSuiteMapper } from "../../../src/workers/test-explorer/spec-to-test-suite.mapper";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import { SpecResultGroupToSuites } from "./../../../src/workers/test-explorer/spec-result-groupby";

jest.mock("./../../../src/workers/test-explorer/spec-result-groupby");

const groupByResults = [
  { name: "suite1", suites: [], tests: ["test1"] },
  {
    name: "suite2",
    tests: ["test2"],
    suites: [{ name: "innersuite1", tests: ["test3", "test4"], suites: [{ name: "innersuite2", tests: ["test5"], suites: [] }] }],
  },
  { name: "suite3", tests: [], suites: [{ name: "innersuite3", tests: ["test6"], suites: [] }] },
] as any;

const expectedResult = [
    {
      id: "suite1",
      label: "suite1",
      type: "suite",
      children: [
        {
          id: "suite1 test1",
          label: "test1",
          type: "test",
        },
      ],
    },
    {
      id: "suite2",
      label: "suite2",
      type: "suite",
      children: [
        {
          id: "suite2 innersuite1",
          label: "innersuite1",
          type: "suite",
          children: [
            {
              id: "suite2 innersuite1 innersuite2",
              label: "innersuite2",
              type: "suite",
              children: [
                {
                  id: "suite2 innersuite1 innersuite2 test5",
                  label: "test5",
                  type: "test",
                },
              ],
            },
            {
              id: "suite2 innersuite1 test3",
              label: "test3",
              type: "test",
            },
            {
              id: "suite2 innersuite1 test4",
              label: "test4",
              type: "test",
            },
          ],
        },
        {
          id: "suite2 test2",
          label: "test2",
          type: "test",
        },
      ],
    },
    {
      id: "suite3",
      label: "suite3",
      type: "suite",
      children: [
        {
          id: "suite3 innersuite3",
          label: "innersuite3",
          type: "suite",
          children: [
            {
              id: "suite3 innersuite3 test6",
              label: "test6",
              type: "test",
            },
          ],
        },
      ],
    },
  ] as TestSuiteInfo[];

test("with correct grouped specs should return correctly mapped TestSuiteInfo", () => {
  // Arrange
  SpecResultGroupToSuites.prototype.group = jest.fn().mockReturnValue(groupByResults);
  const mapper = new SpecToTestSuiteMapper();

  /* savedSpecs dont really matter cause the values are grouped by the mocked dependency SpecResultGroupToSuites */
  const savedSpecs: any[] = [];

  const result = mapper.map(savedSpecs);

  expect(result).toEqual(expectedResult);
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
