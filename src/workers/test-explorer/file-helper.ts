import fs = require("fs");

export class FileHelper {
    public doesFileExists(path: string): boolean {
        return fs.existsSync(path);
    }
    
    public readJSONFile(path:string): any {
        return JSON.parse(fs.readFileSync(path, "utf8"));
    }
}