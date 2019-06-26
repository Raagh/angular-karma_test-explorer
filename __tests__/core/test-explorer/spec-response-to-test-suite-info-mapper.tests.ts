import { TestSuiteInfo } from "vscode-test-adapter-api";
import { SpecResponseToTestSuiteInfoMapper } from "../../../src/core/test-explorer/spec-response-to-test-suite-info.mapper";
import { SpecCompleteResponse } from "../../../src/model/spec-complete-response";

test("suite with one test should be mapped to a full TestSuiteInfo", () => {
  // Arrange
  const savedSpecs = [
    {
      suite: ["suite1"],
      description: "test1",
      filePath: ".",
    },
  ] as SpecCompleteResponse[];
  const expectedResult = [
    {
      id: "suite1",
      label: "suite1",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite1 test1",
          label: "test1",
          type: "test",
          file: ".",
        },
      ],
    },
  ] as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper();

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
    },
    {
      suite: ["suite2", "innersuite1"],
      description: "test3",
      filePath: ".",
    },
    {
      suite: ["suite2", "innersuite1"],
      description: "test4",
      filePath: ".",
    },
    {
      suite: ["suite2", "innersuite1", "innersuite2"],
      description: "test5",
      filePath: ".",
    },
  ] as SpecCompleteResponse[];
  const expectedResult = [
    {
      id: "suite2",
      label: "suite2",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite2 test2",
          label: "test2",
          file: ".",
          type: "test",
        },
        {
          id: "suite2 innersuite1",
          label: "innersuite1",
          type: "suite",
          file: ".",
          children: [
            {
              id: "suite2 innersuite1 test3",
              label: "test3",
              file: ".",
              type: "test",
            },
            {
              id: "suite2 innersuite1 test4",
              label: "test4",
              file: ".",
              type: "test",
            },
            {
              id: "suite2 innersuite1 innersuite2",
              label: "innersuite2",
              type: "suite",
              file: ".",
              children: [
                {
                  id: "suite2 innersuite1 innersuite2 test5",
                  label: "test5",
                  file: ".",
                  type: "test",
                },
              ],
            },
          ],
        },
      ],
    },
  ] as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper();

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
      filePath: ".",
    },
  ] as SpecCompleteResponse[];
  const expectedResult = [
    {
      id: "suite3",
      label: "suite3",
      type: "suite",
      file: ".",
      children: [
        {
          id: "suite3 innersuite3",
          label: "innersuite3",
          type: "suite",
          file: ".",
          children: [
            {
              id: "suite3 innersuite3 test6",
              label: "test6",
              file: ".",
              type: "test",
            },
          ],
        },
      ],
    },
  ] as TestSuiteInfo[];
  const mapper = new SpecResponseToTestSuiteInfoMapper();

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result.children).toEqual(expectedResult);
});
