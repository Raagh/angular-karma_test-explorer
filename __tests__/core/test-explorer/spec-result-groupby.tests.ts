import { SpecResultGroupToSuites } from "../../../src/core/test-explorer/spec-result-groupby";

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
      description: "test6",
    },
    {
      suite: ["suite4"],
      description: "test8",
    },
  ] as any;

  const expectedResult = [
    { name: "suite1", suites: [], tests: [{ name: "test1" }] },
    {
      name: "suite2",
      tests: [{ name: "test2" }],
      suites: [
        {
          name: "innersuite1",
          tests: [{ name: "test3" }, { name: "test4" }],
          suites: [{ name: "innersuite2", tests: [{ name: "test5" }], suites: [] }],
        },
      ],
    },
    { name: "suite3", tests: [], suites: [{ name: "innersuite3", tests: [{ name: "test6" }], suites: [] }] },
    { name: "suite4", suites: [], tests: [{ name: "test8" }] },
  ];

  const result = grouper.group(savedSpecs);

  expect(result).toEqual(expectedResult);
});
