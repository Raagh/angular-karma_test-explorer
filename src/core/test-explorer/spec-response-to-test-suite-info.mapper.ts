import { SpecCompleteResponse } from "../../model/spec-complete-response";
import { TestSuiteInfo, TestInfo } from "vscode-test-adapter-api";

export class SpecResponseToTestSuiteInfoMapper {
  public constructor() {}

  public map(specs: SpecCompleteResponse[]): TestSuiteInfo {
    const rootSuiteNode = {
      type: "suite",
      id: "root",
      label: "root",
      children: [],
    } as TestSuiteInfo;

    for (const spec of specs) {
      const suiteNames = this.filterSuiteNames(spec.suite);
      const suiteNode = this.getOrCreateLowerSuiteNode(rootSuiteNode, spec, suiteNames);
      this.createTest(spec, suiteNode, suiteNames.join(" "));
    }

    return rootSuiteNode;
  }

  private getOrCreateLowerSuiteNode(node: TestSuiteInfo, spec: SpecCompleteResponse, suiteNames: string[]): TestSuiteInfo {
    for (let i = 0; i < suiteNames.length; i++) {
      const suiteName = suiteNames[i];
      if (suiteName == null) {
        suiteNames.splice(i, 1);
        const message = "[Karma bug found] Suite name is null. Please file an issue in the https://github.com/karma-runner/karma/issues";
        global.console.error(message);
        continue;
      }
      let nextNode = this.findNodeByKey(node, suiteName);
      if (!nextNode) {
        const locationHint = suiteNames.join(" ");
        nextNode = this.createSuite(spec, locationHint);
        node.children.push(nextNode);
      }
      node = nextNode;
    }
    return node;
  }

  private findNodeByKey(node: TestInfo | TestSuiteInfo, suiteLookup: string): TestSuiteInfo | undefined {
    if (node.type === "test") {
      return undefined;
    }

    if (node.label === suiteLookup) {
      return node;
    } else {
      for (const child of node.children) {
        if (child.label === suiteLookup) {
          return child as TestSuiteInfo;
        }
      }
    }

    return undefined;
  }

  private filterSuiteNames(suiteNames: string[]) {
    if (suiteNames.length > 0 && "Jasmine__TopLevel__Suite" === suiteNames[0]) {
      suiteNames = suiteNames.slice(1);
    }
    return suiteNames;
  }

  private createTest(specComplete: SpecCompleteResponse, suiteNode: TestSuiteInfo, suiteLookup: string) {
    suiteNode.children.push({
      id: suiteLookup + " " + specComplete.description,
      label: specComplete.description,
      file: specComplete.filePath,
      type: "test",
    } as TestInfo);
  }

  private createSuite(specComplete: SpecCompleteResponse, suiteLookup: string): TestSuiteInfo {
    return {
      id: suiteLookup,
      label: specComplete.suite[specComplete.suite.length - 1],
      file: specComplete.filePath,
      type: "suite",
      children: [],
    } as TestSuiteInfo;
  }
}
