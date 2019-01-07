import * as karma from "karma";
import * as io from "socket.io-client";

export class AngularReporter {
  private static _instance: AngularReporter;
  static get instance(): AngularReporter {
    if (!this._instance) {
      this._instance = new AngularReporter();
    }
    return this._instance;
  }
  private readonly socket: SocketIOClient.Socket;
  public adapters: any[] = [];

  private constructor() {
    this.socket = io("http://localhost:1111/");
  }

  public onListening(port: number) {
    this.socket.emit("server_start", port);
  }

  public onSpecComplete(browser: any, spec: any) {
    const name = spec.suite.reduce((name: any, suite: any) => name + suite + " ", "") + spec.description;
    let status = "failed";
    if (spec.skipped) {
      status = "skipped";
    } else if (spec.success) {
      status = "success";
    }
    const testResult: any = {
      failureMessages: spec.log,
      name,
      status,
      timeSpentMs: spec.time,
    };
    this.socket.emit("test_result", testResult);
  }

  public onRunComplete(runResult: karma.TestResults) {
    this.socket.emit("run_complete", this.collectRunState(runResult));
  }

  public onBrowsersReady() {
    this.socket.emit("browsers_ready");
  }

  public onBrowserError(browser: any, error: any) {
    // Karma 2.0 has different error messages
    if (error.message) {
      this.socket.emit("browser_error", error.message);
    } else {
      this.socket.emit("browser_error", error.toString());
    }
  }

  public onCompileError(errors: string[]) {
    // This is called from angular cli logic
    // https://github.com/angular/angular-cli/blob/012672161087a05ae5ecffbed5d1ee307ce1e0ad/packages/angular_devkit/build_angular/src/angular-cli-files/plugins/karma.ts#L96
    this.socket.emit("compile_error", errors);
  }

  private collectRunState(runResult: karma.TestResults): any {
    if (runResult.disconnected) {
      return "timeout";
    } else if (runResult.error) {
      return "error";
    } else {
      return "complete";
    }
  }
}
