import { FileHelper } from "../integration/file-helper";
const glob = require("glob");

export class PathFinder {
  public constructor(private readonly fileHelper: FileHelper) {}
  public parseTestFiles(pattern: any, encoding: any) {
    var paths = {};
    glob.sync(pattern).find((path: any, index: number, array: any) => {
      this.parseTestFile(paths, path, this.testFileData(path, encoding));
    });
    return paths;
  }

  public testFile(paths: any, describe: any, it: any) {
    var testFile = Object.keys(paths).find(path => this.exist(paths, path, describe, it));
    if (testFile === undefined) {
      global.console.log("Test file path not found! %s | %s | %s", JSON.stringify(paths), describe, it);
    }
    return testFile;
  }

  private testFileData(path: any, encoding: any) {
    return this.removeNewLines(this.removeComments(this.fileHelper.readFile(path, encoding)));
  }

  private parseTestFile(paths: any, path: any, data: any) {
    var result,
      regex = this.regexPattern();
    while ((result = regex.exec(data)) != null) {
      var type = result[2] || result[3];
      var text = result[5];
      if (paths[path] == undefined) {
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
    return paths[path].describe.find((element: any) => describe.startsWith(element) || this.escapeQuotes(describe).startsWith(element)) !== undefined;
  }

  private existIt(paths: any, path: any, it: any) {
    return paths[path].it.find((element: any) => it.startsWith(element) || this.escapeQuotes(it).startsWith(element)) !== undefined;
  }

  private regexPattern(): RegExp {
    return new RegExp("/((describe)|(it))s*(s*((?<![\\])[`'\"])((?:.(?!(?<![\\])\4))*.?)\4/gi");
  }

  private escapeQuotes(str: any) {
    return str.replace(/\\([\s\S])|("|')/g, "\\$1$2");
  }

  private removeComments(data: any) {
    return data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");
  }

  private removeNewLines(data: any) {
    return data.replace(/\r?\n|\r/g, "");
  }
}
