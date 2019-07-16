import * as karma from "karma";
declare module "karma" {
  interface Config extends karma.ConfigOptions { }
  interface ConfigOptions {
    detached?: boolean;
    configFile?: string;
    coverageIstanbulReporter?: any;
    reporters: string[];
  }

  interface Reporter {
    name: string;
    instance: any;
  }

  interface CustomLauncher {
    debug: boolean;
  }
}
