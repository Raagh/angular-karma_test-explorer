import { EventEmitter } from "events";
import * as karma from "karma";

export class AngularReporter extends EventEmitter {
  private static _instance = new AngularReporter();
  static get instance(): AngularReporter {
    if (!this._instance) {
      this._instance = new AngularReporter();
    }
    return this._instance;
  }
  public adapters: any[] = [];

  private constructor() {
    super();
  }

  public onListening(port: number) {
    this.emit("server_start", port);
  }

  public onSpecComplete(browser: any, spec: any) {
    this.emit("test_result", spec);
  }

  public onRunComplete(runResult: karma.TestResults) {
    this.emit("run_complete", runResult);
  }

  public onBrowserComplete(browser: any, result: { coverage: any }) {
    this.emit("coverage_report", result.coverage);
  }

  public onBrowsersReady() {
    this.emit("browsers_ready");
  }

  public onBrowserError(browser: any, error: any) {
    // Karma 2.0 has different error messages
    if (error.message) {
      this.emit("browser_error", error.message);
    } else {
      this.emit("browser_error", error.toString());
    }
  }

  public onCompileError(errors: string[]) {
    // This is called from angular cli logic
    // https://github.com/angular/angular-cli/blob/012672161087a05ae5ecffbed5d1ee307ce1e0ad/packages/angular_devkit/build_angular/src/angular-cli-files/plugins/karma.ts#L96
    this.emit("compile_error", errors);
  }
}
