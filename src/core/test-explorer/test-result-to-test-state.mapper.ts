import { TestState } from "./../../model/test-state.enum";
import { TestResult } from "./../../model/test-status.enum";
export class TestResultToTestStateMapper {
  public constructor() {}

  public Map(testResult: TestResult): TestState {
    switch (testResult) {
      case TestResult.Failed:
        return TestState.Failed;
        break;
      case TestResult.Skipped:
        return TestState.Skipped;
        break;
      case TestResult.Success:
        return TestState.Passed;
        break;
    }
  }
}
