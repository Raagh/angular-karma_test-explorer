import { SpecResultGroupToSuites } from "../../../src/workers/test-explorer/spec-result-groupby";

test("SpecResultToSuiteGroupBy should return grouped values with multiple levels of suites", () => {
  const grouper = new SpecResultGroupToSuites();
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
      suite: ["suite2", "innersuite1"],
      description: "test3",
    },
    {
      suite: ["suite2", "innersuite1"],
      description: "test4",
    },
    {
      suite: ["suite2", "innersuite1", "innersuite2"],
      description: "test5",
    },
    {
      suite: ["suite3", "innersuite3"],
      description: "test6"
    }
  ] as any;
  
  const expectedResult = [
    { name: "suite1", suites: [], tests: ["test1"] },
    { name: "suite2", tests:["test2"], suites: 
        [{ name: "innersuite1", tests: ["test3", "test4"], suites: 
                [{ name: "innersuite2", tests: ["test5"], suites: [] }] 
        }] 
    },
    { name: "suite3", tests: [], suites:[
       { name: "innersuite3", tests:["test6"], suites:[] }
    ]}
  ];

  const result = grouper.group(savedSpecs);

  expect(result).toEqual(expectedResult);
});
