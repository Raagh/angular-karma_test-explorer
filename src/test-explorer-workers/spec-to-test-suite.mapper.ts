import { Helper } from "../helper";
import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";
export class SpecToTestSuiteMapper {
  public constructor() {}

  public map(savedSpecs: any[]): TestSuiteInfo {
    const suites = Helper.groupBy(savedSpecs, "suite");

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
