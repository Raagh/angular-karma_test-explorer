
import { Config, ConfigOptions } from "karma";
import * as path from "path";
import * as AngularReporter from "../workers/angular/angular-reporter";
import { TestExplorerHelper } from "../workers/test-explorer/test-explorer-helper";

export class KarmaConfigurator {
  private readonly testExplorerHelper: TestExplorerHelper;
  constructor(private globalSettings: any) {
    this.testExplorerHelper = new TestExplorerHelper();
  }

  public setMandatoryOptions(config: Config) {
    config.set({
      browsers: ["ChromeHeadless"],
      frameworks: ["jasmine"],
      // No auto watch, the UI will inform us when we need to test
      autoWatch: false,
      // Override browserNoActivityTimeout. Default value 10000 might not enough to send perTest coverage results
      browserNoActivityTimeout: undefined,
      detached: false,
      singleRun: false,
    });
  }

  public setUserKarmaConfigFile(config: Config) {
    if (this.globalSettings.karmaConfigFile && typeof this.globalSettings.karmaConfigFile === "string") {
      const configFileName = path.resolve(this.globalSettings.karmaConfigFile);
      global.console.log('Importing config from "%s"', configFileName);
      try {
        let userConfig = require(configFileName);
        // https://github.com/karma-runner/karma/blob/v1.7.0/lib/config.js#L364
        if (typeof userConfig === "object" && typeof userConfig.default !== "undefined") {
          userConfig = userConfig.default;
        }
        userConfig(config);
        config.configFile = configFileName; // override config to ensure karma is as user-like as possible
      } catch (error) {
        if (error.code === "MODULE_NOT_FOUND") {
          global.console.log(
            `Unable to find karma config at "${
              this.globalSettings.karmaConfigFile
            }" (tried to load from ${configFileName}). Please check your stryker config.
              You might need to make sure the file is included in the sandbox directory.`
          );
        } else {
          global.console.log(`Could not read karma configuration from ${this.globalSettings.karmaConfigFile}.`, error);
        }
      }
    }
  }

  public setUserKarmaConfig(config: Config) {
    if (this.globalSettings.karmaConfig) {
      config.set(this.globalSettings.karmaConfig);
    }
  }

  public setBasePath(config: Config) {
    if (!config.basePath) {
      // We need to set the base path, so karma won't use this file to base everything of
      if (this.globalSettings.karmaConfigFile) {
        config.basePath = path.resolve(path.dirname(this.globalSettings.karmaConfigFile));
      } else {
        config.basePath = process.cwd();
      }
    }
  }

  public disableSingleRunPermanently(config: Config) {
    config.singleRun = false;
    const prevSet = config.set;
    if (typeof prevSet === "function") {
      config.set = (newConfig: ConfigOptions) => {
        if (newConfig != null) {
          if (newConfig.singleRun === true) {
            newConfig.singleRun = false;
          }
          prevSet(newConfig);
        }
      };
    }
  }

  public removeWrongUserConfigValues(config: Config) {
    const filteredReporters = this.testExplorerHelper.removeElementsFromArrayWithoutModifyingIt(config.reporters, ["dots", "progress"]);
    config.reporters = filteredReporters;
  }

  public configureAngularReporter(config: Config) {
    this.addPlugin(config, { [`reporter:${AngularReporter.name}`]: ["type", AngularReporter.instance] });
    if (!config.reporters) {
      config.reporters = [];
    }
    config.reporters.push(AngularReporter.name);
  }

  private addPlugin(karmaConfig: ConfigOptions, karmaPlugin: any) {
    karmaConfig.plugins = karmaConfig.plugins || ["karma-*"];
    karmaConfig.plugins.push(karmaPlugin);
  }
}
