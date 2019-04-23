import { OutputChannel } from "vscode";
import { TestResult } from "../../model/test-status.enum";
import { LogLevel } from "../../model/log-level.enum";

export const OUTPUT_CHANNEL = "Angular/Karma Test Logs";

interface Ilog {
  message: string;
  date: Date;
  level: LogLevel;
}

export class Logger {
  private outputChannel: OutputChannel | undefined;

  constructor(outputChannel: OutputChannel) {
    this.outputChannel = outputChannel;
  }

  public debug(msg: string, ...params: any[]) {
    global.console.log(this.formatMsg(msg));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(msg));
    }
  }

  public info(msg: string, ...params: any[]) {
    global.console.log(this.formatMsg(msg));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(msg));
    }

    if (params.length > 0) {
      if (params[0]!.addDividerForKarmaLogs) {
        this.divideKarmaLogsContent();
      }
    }
  }

  public warn(msg: string, ...params: any[]) {
    global.console.log(this.formatMsg(msg));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(msg));
    }
  }

  public error(msg: string, ...params: any[]) {
    global.console.log(this.formatMsg(msg));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(msg));
    }
  }

  public karmaLogs(msg: string) {
    global.console.log(msg);

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(msg);
    }
  }

  public status(status: TestResult) {
    let msg;
    if (status === TestResult.Success) {
      msg = `[SUCCESS] ✅ Passed`;
    } else if (status === TestResult.Failed) {
      msg = `[FAILURE] ❌ failed`;
    } else {
      msg = `[SKIPPED] Test Skipped`;
    }

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(msg);
    }
  }

  private formatMsg(msg: string): string {
    const { message, date, level }: Ilog = {
      message: msg,
      date: new Date(),
      level: LogLevel.INFO,
    };

    return `[${date.toLocaleTimeString()}] ${level.toUpperCase()}: ${message}`;
  }

  private divideKarmaLogsContent() {
    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine("******************************* Karma Logs *******************************");
    }
  }
}
