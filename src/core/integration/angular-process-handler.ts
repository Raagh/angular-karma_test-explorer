import { KarmaEventListener } from "../integration/karma-event-listener";
import { SpawnOptions } from "child_process";
import { Logger } from "../shared/logger";
const spawn = require("cross-spawn");
export class AngularProcessHandler {
  private angularProcess: any;
  public constructor(private readonly logger: Logger, private readonly karmaEventListener: KarmaEventListener) {}

  public create(command: string, processArguments: string[], options: SpawnOptions): any {
    this.angularProcess = spawn(command, processArguments, options);
    this.setupProcessOutputs();
  }

  public isProcessRunning(): boolean {
    return this.angularProcess != undefined;
  }

  public kill(): Promise<void> {
    return new Promise<void>(resolve => {
      var kill = require("tree-kill");
      kill(this.angularProcess.pid, "SIGTERM", () => {
        this.logger.info(`Angular exited succesfully`);
        resolve();
      });
    });
  }

  private setupProcessOutputs() {
    this.angularProcess.stdout.on("data", (data: any) => {
      const { isTestRunning } = this.karmaEventListener;
      const regex = new RegExp(/\(.*?)\m/, "g");
      if (isTestRunning) {
        let log = data.toString().replace(regex, "");
        if (log.startsWith("e ")) {
          log = "HeadlessChrom" + log;
        }
        this.logger.karmaLogs(`${log}`);
      }
    });
    this.angularProcess.stderr.on("data", (data: any) => this.logger.error(`stderr: ${data}`));
    this.angularProcess.on("error", (err: any) => this.logger.error(`error from ng child process: ${err}`));

    // Prevent karma server from being an orphan process.
    // For example, if VSCODE is killed using SIGKILL, karma server will still be alive.
    // When VSCODE is terminated, karma server's standard input is closed automatically.
    process.stdin.on("close", async () => {
      // terminating orphan process
      await this.kill();
    });
  }
}
