import * as expectedTests from "../../../__mocks__/expectedTests.mock";
import { SpecResponseToTestSuiteInfoMapper } from "../../../src/core/test-explorer/spec-response-to-test-suite-info.mapper";
import { SpecCompleteResponse } from "../../../src/model/spec-complete-response";

const savedSpecs = [
  {
    suite: ["suite1"],
    description: "test1",
    filePath: ".",
  },
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
  {
    suite: ["suite3", "innersuite3"],
    description: "test6",
    filePath: ".",
  },
] as SpecCompleteResponse[];

test("SpecCompleteResponse should be mapped to a full TestSuiteInfo", () => {
  // Arrange
  const mapper = new SpecResponseToTestSuiteInfoMapper();

  // Act
  const result = mapper.map(savedSpecs);

  // Assert
  expect(result.children).toEqual(expectedTests.mock);
});
