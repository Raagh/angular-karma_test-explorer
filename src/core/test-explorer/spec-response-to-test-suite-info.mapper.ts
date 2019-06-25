import { SpecCompleteResponse } from "../../model/spec-complete-response";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class SpecResponseToTestSuiteInfoMapper {
  public constructor() {}

  public map(specs: SpecCompleteResponse[]): TestSuiteInfo {
    return {} as TestSuiteInfo;
  }
}
