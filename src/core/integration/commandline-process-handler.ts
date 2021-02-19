import { KarmaEventListener } from "./karma-event-listener";
import { ChildProcess, SpawnOptions } from "child_process";
import { Logger } from "../shared/logger";

const spawn = require("cross-spawn");
export class CommandlineProcessHandler {

  private angularProcess!: ChildProcess;

  public constructor(
    private readonly logger: Logger,
    private readonly karmaEventListener: KarmaEventListener
  ) { }

  public create(command: string, processArguments: string[], options: SpawnOptions): void {

    this.angularProcess = spawn(command, processArguments, options);
    this.setupProcessOutputs();

  }

  public isProcessRunning(): boolean {
    return this.angularProcess !== undefined;
  }

  public killAsync(): Promise<void> {
    return new Promise<void>(resolve => {
      const kill = require("tree-kill");
      kill(this.angularProcess.pid, "SIGTERM", () => {
        this.logger.info(`Angular exited succesfully`);
        resolve();
      });
    });
  }

  public kill(): void {

    const kill = require("tree-kill");
    kill(this.angularProcess.pid, "SIGKILL");

  }

  private setupProcessOutputs() {

    if (this.angularProcess.stdout) {

      this.angularProcess.stdout.on("data", (data: any) => {

        const { isTestRunning } = this.karmaEventListener;
        if (isTestRunning) {

          const regex = new RegExp(/\(.*?)\m/, "g");
          let log = data.toString().replace(regex, "");
          if (log.startsWith("e ")) {
            log = "HeadlessChrom" + log;
          }
          this.logger.karmaLogs(`${log}`);

        } else {

          // Errors running karma come through here
          const sMessage: string = data.toString().trim();
          if (sMessage.includes('Exception') || sMessage.includes('error')){
            this.logger.error(sMessage);
          }

        }

      });

    } else {
      this.logger.error('Ng process stdout was not defined: ' + this.angularProcess.stdout);
    }

    if (this.angularProcess.stderr) {

      this.angularProcess.stderr.on("data", (data: Buffer) => {
        this.logger.error(`stderr: ${data}`);
      });
      this.angularProcess.stderr.on("error", (data: any) => {
        this.logger.error(`stderr: ${data}`);
      });

    } else {
      this.logger.error('Ng process stderr was not defined: ' + this.angularProcess.stderr);
    }

    this.angularProcess.on("error", (err: any) => {
      this.logger.error(`error from ng child process: ${err}`);
    });

    // Prevent karma server from being an orphan process.
    // For example, if VSCODE is killed using SIGKILL, karma server will still be alive.
    // When VSCODE is terminated, karma server's standard input is closed automatically.
    process.stdin.on("close", async () => {
      // terminating orphan process
      this.kill();
    });

  }

}
