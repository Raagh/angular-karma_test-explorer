import { TestDecoration } from 'vscode-test-adapter-api';

export class TestExplorerHelper {
  public constructor() {}
  public groupBy(xs: any, key: any) {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  public removeElementsFromArrayWithoutModifyingIt(elements: any[] | undefined, elementsToRemove: any[]) {
    if (elements === undefined) { return []; }

    if (Array.isArray(elementsToRemove)) {
      return elements.filter((element) => {
        if (typeof element === 'object') {
          const key = Object.keys(element)[0];
          return !elementsToRemove.some(x => key in x);
        }

        return elementsToRemove.indexOf(element) < 0;
      });
    }
    else {
      return elements.filter((element) => {
        return elementsToRemove !== element;
      });
    }
  }

  public createDecorations(testName: string, failureMessages: string[]) : TestDecoration[] {
    return failureMessages.map(x => this.createDecoration(x, ""));
  }

  private createDecoration(failure: string, testfile: string): TestDecoration {
    return {
      line: 19,
      message: failure
    }
  }
}
