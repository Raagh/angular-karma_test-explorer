import { FileHelper } from "./../integration/file-helper";
import * as glob from "glob";
import * as RegExpEscape from "escape-string-regexp";

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

  public getSpecLine(spec: string, path: string, encoding: string): number | undefined {
    const fileText = this.fileHelper.readFile(path, encoding) as any;

    if (!fileText) {
      return;
    }

    return this.findLineContaining(spec, fileText);
  }
  public getTestFilePath(paths: any, describe: any, it: any) {
    const testFile = Object.keys(paths).find(path => this.exist(paths, path, describe, it));

    return testFile;
  }

  private getTestFileData(path: any, encoding: any) {
    const fileText = this.fileHelper.readFile(path, encoding);

    return this.removeNewLines(this.removeComments(fileText));
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
    const existsDescribe = paths[path].describe.some((element: any) => describe.startsWith(element));
    const existsIt = paths[path].it.some((element: any) => it.startsWith(element));

    return existsDescribe && existsIt;
  }

  private removeComments(data: any) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");
  }

  private removeNewLines(data: any) {
    return data.replace(/\r?\n|\r/g, "");
  }

  private findLineContaining(needle: string, haystack: string | undefined): number | undefined {
    if (!haystack) {
      return undefined;
    }

    const index = haystack.search(RegExpEscape(needle));
    if (index < 0) {
      return undefined;
    }

    return haystack.substr(0, index).split("\n").length - 1;
  }
}
