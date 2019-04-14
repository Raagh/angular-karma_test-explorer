import { Config, ConfigOptions } from "karma";
import * as path from "path";
import * as TestExplorerCustomReporter from "../workers/karma/test-explorer-custom-reporter";
import { TestExplorerHelper } from "../workers/test-explorer/test-explorer-helper";

export class KarmaConfigurator {
  private readonly testExplorerHelper: TestExplorerHelper;
  constructor() {
    this.testExplorerHelper = new TestExplorerHelper();
  }

  public setMandatoryOptions(config: Config) {
    // remove 'logLevel' changing
    // https://github.com/karma-runner/karma/issues/614 is ready
    config.logLevel = config.LOG_INFO;
    config.autoWatch = false;
    config.autoWatchBatchDelay = 0;
    config.browsers = ["ChromeHeadless"];
    config.singleRun = false;
  }

  public dontLoadOriginalConfigurationFileIntoBrowser(config: Config, originalConfigPath: string) {
    // https://github.com/karma-runner/karma-intellij/issues/9
    config.exclude = config.exclude || [];
    config.exclude.push(originalConfigPath);
  }

  public setBasePath(config: Config, originalConfigPath: string) {
    if (!config.basePath) {
      // We need to set the base path, so karma won't use this file to base everything of
      if (originalConfigPath) {
        config.basePath = path.resolve(path.dirname(originalConfigPath));
      } else {
        config.basePath = process.cwd();
      }
    }
  }

  public disableSingleRunPermanently(config: Config) {
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

  public cleanUpReporters(config: Config) {
    const filteredReporters = this.testExplorerHelper.removeElementsFromArrayWithoutModifyingIt(config.reporters, ["dots", "kjhtml"]);
    config.reporters = filteredReporters;
  }

  public loadOriginalUserConfiguration(config: Config, originalConfigPath: string) {
    let originalConfigModule = require(originalConfigPath);
    // https://github.com/karma-runner/karma/blob/v1.7.0/lib/config.js#L364
    if (typeof originalConfigModule === "object" && typeof originalConfigModule.default !== "undefined") {
      originalConfigModule = originalConfigModule.default;
    }

    originalConfigModule(config);
  }

  public configureTestExplorerCustomReporter(config: Config) {
    this.addPlugin(config, { [`reporter:${TestExplorerCustomReporter.name}`]: ["type", TestExplorerCustomReporter.instance] });
    if (!config.reporters) {
      config.reporters = [];
    }
    config.reporters.push(TestExplorerCustomReporter.name);
  }

  private addPlugin(karmaConfig: ConfigOptions, karmaPlugin: any) {
    karmaConfig.plugins = karmaConfig.plugins || ["karma-*"];
    karmaConfig.plugins.push(karmaPlugin);
  }
}
