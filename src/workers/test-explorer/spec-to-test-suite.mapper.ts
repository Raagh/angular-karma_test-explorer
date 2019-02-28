import { TestExplorerHelper } from "./test-explorer-helper";
import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";
export class SpecToTestSuiteMapper {
  private readonly testExplorerHelper: TestExplorerHelper;
  public constructor() {
    this.testExplorerHelper = new TestExplorerHelper();
  }

  public map(savedSpecs: any[]): TestSuiteInfo {
    const suites = this.testExplorerHelper.groupBy(savedSpecs, "suite");

    return {
      type: "suite",
      id: "root",
      label: "Angular",
      children: Object.keys(suites).map<TestSuiteInfo>(
        (key: any, index: any): TestSuiteInfo => {
          return {
            type: "suite",
            id: key,
            label: key,
            children: suites[key].map(
              (x: any): TestInfo => {
                return {
                  type: "test",
                  id: x.suite[0] + " " + x.description,
                  label: x.description,
                };
              }
            ),
          };
        }
      ),
    };
  }
}
