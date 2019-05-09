import { KarmaEventListener } from "../integration/karma-event-listener";
import { SpawnOptions } from "child_process";
import { Logger } from "../shared/logger";
const spawn = require("cross-spawn");
export class AngularProcessHandler {
  private process: any;
  public constructor(private readonly logger: Logger, private readonly karmaEventListener: KarmaEventListener) {}

  public create(command: string, processArguments: string[], options: SpawnOptions): any {
    this.process = spawn(command, processArguments, options);
    this.setupProcessOutputs();
  }

  public kill() {
    this.process.kill();
  }

  public onExitEvent(): Promise<void> {
    return new Promise<void>(resolve => {
      this.process.on("exit", (code: any, signal: any) => {
        this.logger.info(`Angular exited with code ${code} and signal ${signal}`);
        resolve();
      });
    });
  }

  private setupProcessOutputs() {
    this.process.stdout.on("data", (data: any) => {
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
    this.process.stderr.on("data", (data: any) => this.logger.error(`stderr: ${data}`));
    this.process.on("error", (err: any) => this.logger.error(`error from ng child process: ${err}`));
  }
}
