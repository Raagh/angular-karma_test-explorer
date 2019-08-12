import { TestSuiteInfo } from "vscode-test-adapter-api";
import { SpecResponseToTestSuiteInfoMapper } from "../../../src/core/test-explorer/spec-response-to-test-suite-info.mapper";
import { SpecCompleteResponse } from "../../../src/model/spec-complete-response";

test("suite with one test should be mapped to a full TestSuiteInfo", () => {
  // Arrange
  const savedSpecs = [
    {
      suite: ["suite1"],
      description: "test1",
      id: "spec0",
      filePath: ".",
      line: undefined,
    },
  ] as SpecCompleteResponse[];
  const expectedResult = ([
    {
      id: "suite1",
      label: "suite1",
      fullName: "suite1",
      type: "suite",
      file: ".",
      children: [
        {
          id: "spec0",
          label: "test1",
          type: "test",
          file: ".",
          fullName: "suite1 test1",
          line: undefined,
        },
      ],
    },
  ] as unknown) as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper("");

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result.children).toEqual(expectedResult);
});

test("suite with multiple level innersuites should be mapped to a full TestSuiteInfo", () => {
  // Arrange
  const savedSpecs = [
    {
      suite: ["suite2"],
      description: "test2",
      filePath: ".",
      id: "spec0",
    },
    {
      suite: ["suite2", "innersuite1"],
      description: "test3",
      filePath: ".",
      id: "spec0",
    },
    {
      suite: ["suite2", "innersuite1"],
      description: "test4",
      filePath: ".",
      id: "spec0",
    },
    {
      suite: ["suite2", "innersuite1", "innersuite2"],
      description: "test5",
      filePath: ".",
      id: "spec0",
    },
  ] as SpecCompleteResponse[];
  const expectedResult = ([
    {
      id: "suite2",
      label: "suite2",
      fullName: "suite2",
      type: "suite",
      file: ".",
      children: [
        {
          id: "spec0",
          label: "test2",
          fullName: "suite2 test2",
          file: ".",
          type: "test",
          line: undefined,
        },
        {
          id: "suite2 innersuite1",
          label: "innersuite1",
          fullName: "innersuite1",
          type: "suite",
          file: ".",
          children: [
            {
              id: "spec0",
              label: "test3",
              fullName: "suite2 innersuite1 test3",
              file: ".",
              type: "test",
              line: undefined,
            },
            {
              id: "spec0",
              label: "test4",
              fullName: "suite2 innersuite1 test4",
              file: ".",
              type: "test",
              line: undefined,
            },
            {
              id: "suite2 innersuite1 innersuite2",
              label: "innersuite2",
              fullName: "innersuite2",
              type: "suite",
              file: ".",
              children: [
                {
                  id: "spec0",
                  label: "test5",
                  fullName: "suite2 innersuite1 innersuite2 test5",
                  file: ".",
                  type: "test",
                  line: undefined,
                },
              ],
            },
          ],
        },
      ],
    },
  ] as unknown) as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper("");

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result.children).toEqual(expectedResult);
});

test("suite with empty suite and complete innersuite test should be mapped to a full TestSuiteInfo", () => {
  // Arrange
  const savedSpecs = [
    {
      suite: ["suite3", "innersuite3"],
      description: "test6",
      id: "spec0",
      filePath: ".",
    },
  ] as SpecCompleteResponse[];
  const expectedResult = ([
    {
      id: "suite3",
      label: "suite3",
      fullName: "suite3",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite3 innersuite3",
          label: "innersuite3",
          fullName: "innersuite3",
          type: "suite",
          file: ".",
          children: [
            {
              id: "spec0",
              fullName: "suite3 innersuite3 test6",
              line: undefined,
              label: "test6",
              file: ".",
              type: "test",
            },
          ],
        },
      ],
    },
  ] as unknown) as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper("");

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result.children).toEqual(expectedResult);
});

test("suite with one test and undefined filePath should not crash", () => {
  // Arrange
  const savedSpecs = [
    {
      suite: ["suite1"],
      description: "test1",
      id: "spec0",
      filePath: undefined,
    },
  ] as SpecCompleteResponse[];
  const expectedResult = ([
    {
      id: "suite1",
      label: "suite1",
      fullName: "suite1",
      type: "suite",
      file: undefined,
      children: [
        {
          id: "spec0",
          line: undefined,
          fullName: "suite1 test1",
          label: "test1",
          type: "test",
          file: undefined,
        },
      ],
    },
  ] as unknown) as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper("");

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result.children).toEqual(expectedResult);
});
