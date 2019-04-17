import * as karma from "karma";
declare module "karma" {
  interface Config extends karma.ConfigOptions {}
  interface ConfigOptions {
    detached?: boolean;
    configFile?: string;
    coverageIstanbulReporter?: any;
    reporters: any[]
  }

  interface Reporter {
    name: string;
    instance: any;
  }
}
