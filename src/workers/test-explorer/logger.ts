export class Logger {
    constructor() {}

    public log(message: string) {
        global.console.log(message);
    }
}