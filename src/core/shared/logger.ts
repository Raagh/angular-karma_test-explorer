import { OutputChannel } from "vscode";
import { TestResult } from "../../model/enums/test-status.enum";
import { LogLevel } from "../../model/enums/log-level.enum";

export const OUTPUT_CHANNEL = "Test Explorer Logs";

interface Ilog {
  message: string;
  date: Date;
  level: LogLevel;
}

export class Logger {
  private outputChannel?: OutputChannel;

  constructor(outputChannel: OutputChannel, private readonly isDebuggingMode: boolean = false) {
    this.outputChannel = outputChannel;
  }

  public debug(msg: string, ...params: any[]) {
    if (this.isDebuggingMode) {
      global.console.log(this.formatMsg(msg, LogLevel.DEBUG));

      if (this.outputChannel !== undefined) {
        this.outputChannel.appendLine(this.formatMsg(msg, LogLevel.DEBUG));
      }
    }
  }

  public info(msg: string, ...params: any[]) {
    global.console.log(this.formatMsg(msg, LogLevel.INFO));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(msg, LogLevel.INFO));
    }

    if (params.length > 0) {
      if (params[0]!.addDividerForKarmaLogs) {
        this.divideKarmaLogsContent();
      }
    }
  }

  public warn(msg: string, ...params: any[]) {
    if (this.isDebuggingMode) {
      global.console.log(this.formatMsg(msg, LogLevel.WARN));
      if (this.outputChannel !== undefined) {
        this.outputChannel.appendLine(this.formatMsg(msg, LogLevel.WARN));
      }
    }
  }

  public error(msg: string, ...params: any[]) {
    if (this.isDebuggingMode) {
      global.console.log(this.formatMsg(msg, LogLevel.ERROR));
      if (this.outputChannel !== undefined) {
        this.outputChannel.appendLine(this.formatMsg(msg, LogLevel.ERROR));
      }
    }
  }

  public karmaLogs(msg: string) {
    if (this.isDebuggingMode) {
      global.console.log(msg);

      if (this.outputChannel !== undefined) {
        this.outputChannel.appendLine(msg);
      }
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

  private formatMsg(msg: string, loglevel: LogLevel): string {
    const { message, date, level }: Ilog = {
      message: msg,
      date: new Date(),
      level: loglevel,
    };

    return `[${date.toLocaleTimeString()}] ${level.toUpperCase()}: ${message}`;
  }

  private divideKarmaLogsContent() {
    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine("******************************* Karma Logs *******************************");
    }
  }
}
