export class KarmaEventListener {
  public startListening(): void {
    const app = require("express")();
    const http = require("http").Server(app);
    const io = require("socket.io")(http);

    io.on("connection", (socket: any) => {
      socket.on("spec_complete", (testResult: any) => {
        global.console.log("spec_complete - result:" + testResult.status + " - " + "testname:" + testResult.name);
      });

      socket.on("run_complete", (runResult: any) => {
        global.console.log("run_complete " + runResult);
      });

      socket.on("browser_start", () => {
        global.console.log("browser_start");
      });

      socket.on("browser_error", (error: any) => {
        global.console.log("browser_error " + error);
      });
    });

    http.listen(1111, () => {
      global.console.log("listening on port 1111");
    });
  }
}
