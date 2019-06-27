import { TestState } from "../../model/enums/test-state.enum";
import { TestResult } from "../../model/enums/test-status.enum";
export class TestResultToTestStateMapper {
  public constructor() {}

  public Map(testResult: TestResult): TestState {
    switch (testResult) {
      case TestResult.Failed:
        return TestState.Failed;
      case TestResult.Skipped:
        return TestState.Skipped;
      case TestResult.Success:
        return TestState.Passed;
    }
  }
}
