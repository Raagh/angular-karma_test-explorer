const fs = require("fs");
const glob = require("glob");

export class PathFinder {
  public parseTestFiles(pattern: string, encoding: string) {
    const paths = {};
    const results = glob.sync(pattern);
    results.find((path: any, index: any, array: any) => {
      this.parseTestFile(paths, path, this.testFileData(path, encoding));
    });

    return paths;
  }

  public testFile(paths: any, describe: any, it: any) {
    const testFile = Object.keys(paths).find(path => this.exist(paths, path, describe, it));
    if (testFile === undefined) {
      global.console.log("Test file path not found!" + JSON.stringify(paths) + "|" + describe + "|" + it);
    }
    return testFile;
  }

  private testFileData(path: any, encoding: any) {
    return this.removeNewLines(this.removeComments(fs.readFileSync(path, encoding)));
  }

  private parseTestFile(paths: any, path: any, data: any) {
    let result: any;
    const regex = this.regexPattern();
    while (result != null) {
      result = regex.exec(data);
      const type = result[2] || result[3];
      const text = result[5];
      if (paths[path] === undefined) {
        paths[path] = { describe: [], it: [] };
      }
      if (type === "describe") {
        paths[path].describe.push(text);
      }
      if (type === "it") {
        paths[path].it.push(text);
      }
    }
  }

  private exist(paths: any, path: any, describe: any, it: any) {
    return this.existDescribe(paths, path, describe) && this.existIt(paths, path, it);
  }

  private existDescribe(paths: any, path: any, describe: any) {
    return paths[path].describe.find((element: any) => describe.startsWith(this.removeEscapedQuotes(element)));
  }

  private existIt(paths: any, path: any, it: any) {
    return paths[path].it.find((element: any) => it.startsWith(this.removeEscapedQuotes(element)));
  }

  private regexPattern() {
    return /((describe)|(it))\s*\(\s*((?<![\\])[\`\'\"])((?:.(?!(?<![\\])\4))*.?)\4/gi;
  }

  private removeEscapedQuotes(str: any) {
    return str.replace(/(?:\\|\\\\)((")|(')|(`))/g, "$1");
  }

  private removeComments(data: any) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");
  }

  private removeNewLines(data: any) {
    return data.replace(/\r?\n|\r/g, "");
  }
}
