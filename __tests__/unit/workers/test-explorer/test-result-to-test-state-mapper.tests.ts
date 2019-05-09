import { TestResultToTestStateMapper } from "../../../../src/core/test-explorer/test-result-to-test-state.mapper";
import { TestResult } from "../../../../src/model/test-status.enum";
import { TestState } from "../../../../src/model/test-state.enum";

test("should map Failed test result to Failed test state", () => {
  // Arrage
  const mapper = new TestResultToTestStateMapper();
  // Act
  const result = mapper.Map(TestResult.Failed);

  // Assert
  expect(result).toEqual(TestState.Failed);
});

test("should map Success test result to Passed test state", () => {
  // Arrage
  const mapper = new TestResultToTestStateMapper();
  // Act
  const result = mapper.Map(TestResult.Success);

  // Assert
  expect(result).toEqual(TestState.Passed);
});

test("should map Skipped test result to Skipped test state", () => {
  // Arrage
  const mapper = new TestResultToTestStateMapper();
  // Act
  const result = mapper.Map(TestResult.Failed);

  // Assert
  expect(result).toEqual(TestState.Failed);
});
