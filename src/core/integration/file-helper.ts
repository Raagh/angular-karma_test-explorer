import fs = require("fs");

export class FileHelper {
  public doesFileExists(path: string): boolean {
    return fs.existsSync(path);
  }

  public readJSONFile(path: string): any {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }

  public readFile(path: string, encoding: any) {
    return fs.readFileSync(path, encoding);
  }
}
