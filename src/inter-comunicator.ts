export class InterComunicator {
  public startListening(): void {
    const app = require("express")();
    const http = require("http").Server(app);
    const io = require("socket.io")(http);

    io.on("connection", (socket: any) => {
      socket.on("server_start", (port: number) => {
        global.console.log("server_start on port" + port);
      });

      socket.on("test_result", (testResult: any) => {
        global.console.log("test_result " + testResult);
      });

      socket.on("run_complete", (runResult: any) => {
        global.console.log("run_complete " + runResult);
      });

      socket.on("browsers_ready", () => {
        global.console.log("browsers_ready");
      });

      socket.on("browser_error", (error: any) => {
        global.console.log("browser_error " + error);
      });

      socket.on("compile_error", (errors: any[]) => {
        global.console.log("compile_errors " + errors);
      });
    });

    http.listen(1111, () => {
      global.console.log("listening on port 1111");
    });
  }
}
