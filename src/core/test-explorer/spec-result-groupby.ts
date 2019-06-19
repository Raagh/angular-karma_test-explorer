import { SpecCompleteResponse } from "./../../model/spec-complete-response";
export class SpecResultGroupToSuites {
  public group(savedSpecs: SpecCompleteResponse[]): any {
    const suites: any[] = [];
    savedSpecs.forEach(spec => {
      const specSuiteName = spec.suite[0];
      if (suites.length === 0) {
        suites.push(this.createSuite(specSuiteName, spec.description, spec.filePath));
        return;
      }

      if (spec.suite.length === 1) {
        this.handleOneLevelSuites(suites, specSuiteName, spec);
        return;
      }

      this.handleMultipleLevelSuites(spec, suites);
    });

    return suites;
  }

  private handleMultipleLevelSuites(spec: SpecCompleteResponse, suites: any[]) {
    let lastLevelSuite: any;
    spec.suite.forEach((suite: any, index: any) => {
      const isLastSuite = spec.suite.length - 1 === index;
      let foundSuite = suites.find(x => x.name === suite);
      if (!foundSuite && !isLastSuite && !lastLevelSuite) {
        foundSuite = this.createSuite(suite, undefined, spec.filePath);
        suites.push(foundSuite);
      } else if (!foundSuite && !isLastSuite && lastLevelSuite) {
        const anotherLevelSuite = lastLevelSuite.suites.find((x: any) => x.name === suite);
        if (anotherLevelSuite) {
          foundSuite = anotherLevelSuite;
        } else {
          foundSuite = this.createSuite(suite, undefined, spec.filePath);
          lastLevelSuite.suites.push(foundSuite);
          lastLevelSuite = foundSuite;
        }
      } else if (!foundSuite && isLastSuite && lastLevelSuite) {
        foundSuite = lastLevelSuite.suites.find((x: any) => x.name === suite);
        if (foundSuite) {
          foundSuite.tests.push({ name: spec.description, filePath: spec.filePath });
          lastLevelSuite = foundSuite;
        } else {
          lastLevelSuite.suites.push(this.createSuite(suite, spec.description, spec.filePath));
        }
      } else if (foundSuite && isLastSuite) {
        foundSuite.tests.push({ name: spec.description, filePath: spec.filePath });
      }
      lastLevelSuite = foundSuite;
    });
  }

  private handleOneLevelSuites(suites: any[], specSuiteName: string, spec: SpecCompleteResponse) {
    const foundSuite = suites.find(x => x.name === specSuiteName);
    if (foundSuite) {
      foundSuite.tests.push({ name: spec.description });
    } else {
      suites.push(this.createSuite(specSuiteName, spec.description, spec.filePath));
    }
  }

  private createSuite(specSuiteName: any, testName?: any, filePath?: string): any {
    if (filePath) {
      if (!testName) {
        return { name: specSuiteName, tests: [], suites: [], filePath };
      }
      return { name: specSuiteName, tests: [{ name: testName, filePath }], suites: [], filePath };
    } else {
      if (!testName) {
        return { name: specSuiteName, tests: [], suites: [] };
      }
      return { name: specSuiteName, tests: [{ name: testName }], suites: [] };
    }
  }
}
