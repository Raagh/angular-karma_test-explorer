import { OutputChannel, window } from "vscode";
import { TestResult } from "../../model/test-status.enum";

export const OUTPUT_CHANNEL = "Angular Test Explorer";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

interface Ilog {
  message: string;
  date: Date;
  level: LogLevel;
}

export class Logger {
  private static outputChannel: OutputChannel | undefined;

  public static setOutput() {
    this.outputChannel = this.outputChannel || window.createOutputChannel(OUTPUT_CHANNEL);
  }

  public static debug(msg: string, ...params: any[]) {
    const log: Ilog = {
      message: msg,
      date: new Date(),
      level: LogLevel.DEBUG,
    };

    global.console.log(this.formatMsg(log));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(log));
    }
  }

  public static info(msg: string, ...params: any[]) {
    const log: Ilog = {
      message: msg,
      date: new Date(),
      level: LogLevel.INFO,
    };

    global.console.log(this.formatMsg(log));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(log));
    }
  }

  public static warn(msg: string, ...params: any[]) {
    const log: Ilog = {
      message: msg,
      date: new Date(),
      level: LogLevel.WARN,
    };

    global.console.log(this.formatMsg(log));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(log));
    }
  }

  public static error(msg: string, ...params: any[]) {
    const log: Ilog = {
      message: msg,
      date: new Date(),
      level: LogLevel.ERROR,
    };

    global.console.log(this.formatMsg(log));

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(this.formatMsg(log));
    }
  }

  public static karmaLogsDivider() {
    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine("******************************* Karma Logs *******************************");
    }
  }

  public static karmaLogs(msg: string) {
    global.console.log(msg);

    if (this.outputChannel !== undefined) {
      this.outputChannel.appendLine(msg);
    }
  }

  public static status(status: TestResult) {
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

  private static formatMsg(log: Ilog): string {
    const msg = `[${log.date.toLocaleTimeString()}] ${log.level.toUpperCase()}: ${log.message}`;
    return msg;
  }
}
