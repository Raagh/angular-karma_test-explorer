import { SpawnOptions } from "child_process";
const spawn = require("cross-spawn");
export class ProcessCreator {
  public create(command: string, processArguments: string[], options: SpawnOptions): any {
    return spawn(command, processArguments, options);
  }
}
