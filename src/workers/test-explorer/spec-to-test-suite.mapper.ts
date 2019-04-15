import { SpecResultGroupToSuites } from "./spec-result-groupby";
import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";
export class SpecToTestSuiteMapper {
  private readonly specResultGroupBy: SpecResultGroupToSuites;
  public constructor() {
    this.specResultGroupBy = new SpecResultGroupToSuites();
  }

  public map(savedSpecs: any[]): TestSuiteInfo {
    const suites: any[] = this.specResultGroupBy.group(savedSpecs);

    const rootSuite = {
      type: "suite",
      id: "root",
      label: "Angular",
      children: [],
    } as TestSuiteInfo;

    rootSuite.children = suites.map(suite => this.mapTestsAndSuites(suite)) as TestSuiteInfo[];

    return rootSuite;
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
    } as TestSuiteInfo;

    const mappedTests = suite.tests.map((test: string) => {
      return {
        type: "test",
        id: suiteName + " " + test,
        label: test,
      } as TestInfo;
    });

    const mappedSuites = suite.suites.map((innerSuite: any) => this.mapTestsAndSuites(innerSuite, suiteName));

    initialSuite.children = initialSuite.children.concat(mappedSuites.concat(mappedTests));

    return initialSuite;
  }
}
