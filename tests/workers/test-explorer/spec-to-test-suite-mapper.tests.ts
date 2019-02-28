import { SpecToTestSuiteMapper } from "../../../src/workers/test-explorer/spec-to-test-suite.mapper";
import { TestSuiteInfo } from "vscode-test-adapter-api";

test("SpecToTestSuiteMapper should return correctly mapped TestSuiteInfo", () => {
  const mapper = new SpecToTestSuiteMapper();

  const savedSpecs = [
    {
      suite: "suite",
      description: "description",
    },
    {
      suite: "suite2",
      description: "description2",
    },
  ];
  const expectedResult = {
    children: [
      {
        children: [
          {
            id: "s description",
            label: "description",
            type: "test",
          },
        ],
        id: "suite",
        label: "suite",
        type: "suite",
      },
      {
        children: [
          {
            id: "s description2",
            label: "description2",
            type: "test",
          },
        ],
        id: "suite2",
        label: "suite2",
        type: "suite",
      },
    ],
    id: "root",
    label: "Angular",
    type: "suite",
  } as TestSuiteInfo;

  const result = mapper.map(savedSpecs);

  expect(result).toEqual(expectedResult);
});
