import { SpecResultGroupToSuites } from "./spec-result-groupby";
import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";
import { SpecCompleteResponse } from "../../model/spec-complete-response";
import * as path from "path";

export class SpecToTestSuiteMapper {
  private readonly specResultGroupBy: SpecResultGroupToSuites;
  public constructor(private readonly projectRootPath: string) {
    this.specResultGroupBy = new SpecResultGroupToSuites();
  }

  public map(savedSpecs: SpecCompleteResponse[]): TestSuiteInfo[] {
    const suites: any[] = this.specResultGroupBy.group(savedSpecs);

    return suites.map(suite => this.mapTestsAndSuites(suite)) as TestSuiteInfo[];
  }

  private mapTestsAndSuites(suite: any, previousSuiteName?: string): TestInfo | TestSuiteInfo {
    let suiteName = suite.name;

    if (previousSuiteName) {
      suiteName = previousSuiteName + " " + suite.name;
    }

    const initialSuite = {
      type: "suite",
      id: suiteName,
      label: suite.name,
      children: [],
      file: path.join(this.projectRootPath, suite.filePath ? suite.filePath : ""),
    } as TestSuiteInfo;

    const mappedTests = suite.tests.map((test: any) => {
      return {
        type: "test",
        id: suiteName + " " + test.name,
        label: test.name,
        file: path.join(this.projectRootPath, test.filePath ? test.filePath : ""),
      } as TestInfo;
    });

    const mappedSuites = suite.suites.map((innerSuite: any) => this.mapTestsAndSuites(innerSuite, suiteName));

    initialSuite.children = initialSuite.children.concat(mappedSuites.concat(mappedTests));

    return initialSuite;
  }
}
