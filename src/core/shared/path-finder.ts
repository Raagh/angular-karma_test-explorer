import { FileHelper } from "./../integration/file-helper";
import * as glob from "glob";

export class PathFinder {
  private readonly regexPattern: RegExp = /((describe)|(it))\s*\(\s*((?<![\\])[\`\'\"])((?:.(?!(?<![\\])\4))*.?)\4/gi;
  private readonly describeType = "describe";
  private readonly itType = "it";
  public constructor(private readonly fileHelper: FileHelper) {}

  public getTestFilesPaths(pattern: string, encoding: string) {
    const paths = {};
    const results = glob.sync(pattern);
    results.map((path: any, index: any, array: any) => {
      this.parseTestFile(paths, path, this.getTestFileData(path, encoding));
    });

    return paths;
  }

  public getTestFilePath(paths: any, describe: any, it: any) {
    const testFile = Object.keys(paths).find(path => this.exist(paths, path, describe, it));
    if (testFile === undefined) {
      global.console.log("Test file path not found!" + JSON.stringify(paths) + "|" + describe + "|" + it);
    }
    return testFile;
  }

  private getTestFileData(path: any, encoding: any) {
    return this.removeNewLines(this.removeComments(this.fileHelper.readFile(path, encoding)));
  }

  private parseTestFile(paths: any, path: any, data: any) {
    let result: any;
    while ((result = this.regexPattern.exec(data)) != null) {
      const type = result[2] || result[3];
      const text = result[5];
      if (paths[path] === undefined) {
        paths[path] = { describe: [], it: [] };
      }
      if (type === this.describeType) {
        paths[path].describe.push(text);
      }
      if (type === this.itType) {
        paths[path].it.push(text);
      }
    }
  }

  private exist(paths: any, path: any, describe: any, it: any) {
    return this.existDescribe(paths, path, describe) && this.existIt(paths, path, it);
  }

  private existDescribe(paths: any, path: any, describe: any) {
    return paths[path].describe.some((element: any) => {
      // const elementWithoutQuotes = this.removeEscapedQuotes(element);
      return describe.startsWith(element);
    });
  }

  private existIt(paths: any, path: any, it: any) {
    return paths[path].it.some((element: any) => {
      // const elementWithoutQuotes = this.removeEscapedQuotes(element);
      return it.startsWith(element);
    });
  }

  // private removeEscapedQuotes(str: any) {
  //   return str.replace(/(?:\\|\\\\)((")|(')|(`))/g, "$1");
  // }

  private removeComments(data: any) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");
  }

  private removeNewLines(data: any) {
    return data.replace(/\r?\n|\r/g, "");
  }
}
