import { SpecCompleteResponse } from './../../model/spec-complete-response';
export class SpecResultGroupToSuites {
  public group(savedSpecs: SpecCompleteResponse[]): any {
    const suites: any[] = [];
    savedSpecs.forEach(
      spec => {
        const specSuiteName = spec.suite[0];
        if (suites.length === 0) {
          suites.push(this.createSuite(specSuiteName, spec.description));
          return;
        }

        if (spec.suite.length === 1) {
          this.handleOneLevelSuites(suites, specSuiteName, spec);
          return;
        }

        this.handleMultipleLevelSuites(spec, suites);
      }
    );

    return suites;
  }

  private handleMultipleLevelSuites(spec: SpecCompleteResponse, suites: any[]) {
    let lastLevelSuite: any;
    spec.suite.forEach((suite: any, index: any) => {
      const isLastSuite = (spec.suite.length - 1) === index;
      let foundSuite = suites.find(x => x.name === suite);
      if (!foundSuite && !isLastSuite && !lastLevelSuite) {
        foundSuite = this.createSuite(suite);
        suites.push(foundSuite);
      }
      else if (!foundSuite && !isLastSuite && lastLevelSuite) {
        const anotherLevelSuite = lastLevelSuite.suites.find((x: any) => x.name === suite);
        if (anotherLevelSuite) {
          foundSuite = anotherLevelSuite;
        }
        else {
          foundSuite = this.createSuite(suite);
          lastLevelSuite.suites.push(foundSuite);
          lastLevelSuite = foundSuite;
        }
      }
      else if (!foundSuite && isLastSuite && lastLevelSuite) {
        foundSuite = lastLevelSuite.suites.find((x: any) => x.name === suite);
        if (foundSuite) {
          foundSuite.tests.push(spec.description);
          lastLevelSuite = foundSuite;
        }
        else {
          lastLevelSuite.suites.push(this.createSuite(suite, spec.description));
        }
      }
      else if (foundSuite && isLastSuite) {
        foundSuite.tests.push(spec.description);
      }
      lastLevelSuite = foundSuite;
    });
  }

  private handleOneLevelSuites(suites: any[], specSuiteName: string, spec: SpecCompleteResponse) {
    const foundSuite = suites.find(x => x.name === specSuiteName);
    if (foundSuite) {
      foundSuite.tests.push(spec.description);
    }
    else {
      suites.push(this.createSuite(specSuiteName, spec.description));
    }
  }

  private createSuite(specSuiteName: any, testName?: any): any {
    if(!testName) { 
      return { name: specSuiteName, tests: [], suites: [] }; 
    }
    return { name: specSuiteName, tests: [testName], suites: [] };
  }
}
