import { SpecToTestSuiteMapper } from "../../../src/workers/test-explorer/spec-to-test-suite.mapper";
import { TestSuiteInfo } from "vscode-test-adapter-api";

test("SpecToTestSuiteMapper should return correctly mapped TestSuiteInfo", () => {
  const mapper = new SpecToTestSuiteMapper();

  const savedSpecs = [
    {
      suite: ["suite1"],
      description: "test1",
    },
    {
      suite: ["suite2"],
      description: "test2",
    },
    {
      suite: ["suite2", "innersuite2"],
      description: "test3",
    },
    {
      suite: ["suite2", "innersuite2"],
      description: "test4",
    },
    {
      suite: ["suite2", "innersuite2", "innersuite3"],
      description: "test5",
    },
    
  ];
  const expectedResult = {
    id: "root",
    label: "Angular",
    type: "suite",
    children: [
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
            id: "suite2 innersuite2",
            label: "innersuite2",
            type: "suite",
            children: [
              {
                id: "suite2 innersuite2 innersuite3",
                label: "innersuite3",
                type: "suite",
                children: [
                  {
                    id: "suite2 innersuite2 innersuite3 test5",
                    label: "test5",
                    type: "test",
                  }
                ],
              },
              {
                id: "suite2 innersuite2 test3",
                label: "test3",
                type: "test",
              },
              {
                id: "suite2 innersuite2 test4",
                label: "test4",
                type: "test",
              }
            ],
          },
          {
            id: "suite2 test2",
            label: "test2",
            type: "test",
          },
        ],
      },
    ],
  } as TestSuiteInfo;

  const result = mapper.map(savedSpecs);

  expect(result).toEqual(expectedResult);
});
