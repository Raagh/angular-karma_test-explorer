const fs = require("fs");

export class FileHelper {
  public copyFile(localPath: string, remotePath: string): any {
    if (fs.existsSync(localPath) && !fs.existsSync(remotePath)) {
      fs.copyFileSync(localPath, remotePath, (err: any) => {
        global.console.log("error " + err);
      });
    }
  }

  public deleteFile(remotePath: string) {
    if (fs.existsSync(remotePath)) {
      fs.unlinkSync(remotePath);
    }
  }
}
