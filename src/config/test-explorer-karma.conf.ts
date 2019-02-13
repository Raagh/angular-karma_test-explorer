import { Config, ConfigOptions, Reporter } from "karma";
import * as path from "path";

const AngularReporter: Reporter = require("../angular-workers/angular-reporter");

function setDefaultOptions(config: Config) {
  config.set({
    browsers: ["ChromeHeadless"],
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [require("karma-jasmine"), require("karma-chrome-launcher"), require("@angular-devkit/build-angular/plugins/karma")],
  });
}

function setUserKarmaConfigFile(config: Config) {
  if (globalSettings.karmaConfigFile && typeof globalSettings.karmaConfigFile === "string") {
    const configFileName = path.resolve(globalSettings.karmaConfigFile);
    global.console.log('Importing config from "%s"', configFileName);
    try {
      const userConfig = require(configFileName);
      userConfig(config);
      config.configFile = configFileName; // override config to ensure karma is as user-like as possible
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") {
        global.console.log(
          `Unable to find karma config at "${
            globalSettings.karmaConfigFile
          }" (tried to load from ${configFileName}). Please check your stryker config.
          You might need to make sure the file is included in the sandbox directory.`
        );
      } else {
        global.console.log(`Could not read karma configuration from ${globalSettings.karmaConfigFile}.`, error);
      }
    }
  }
}

/**
 * Sets configuration that is needed to control the karma life cycle. Namely it shouldn't watch files and not quit after first test run.
 * @param config The config to use
 */
function setLifeCycleOptions(config: Config) {
  config.set({
    // No auto watch, stryker will inform us when we need to test
    autoWatch: false,
    // Override browserNoActivityTimeout. Default value 10000 might not enough to send perTest coverage results
    browserNoActivityTimeout: null,
    // Never detach, always run in this same process (is already a separate process)
    detached: false,
    // Don't stop after first run
    singleRun: false,
  });
}

function setUserKarmaConfig(config: Config) {
  if (globalSettings.karmaConfig) {
    config.set(globalSettings.karmaConfig);
  }
}

function setBasePath(config: Config) {
  if (!config.basePath) {
    // We need to set the base path, so karma won't use this file to base everything of
    if (globalSettings.karmaConfigFile) {
      config.basePath = path.resolve(path.dirname(globalSettings.karmaConfigFile));
    } else {
      config.basePath = process.cwd();
    }
  }
}

function disableSingleRun(config: Config) {
  config.singleRun = false;
  const prevSet = config.set;
  // Workaround if karma server is instantiated with { singleRun: true }
  // For example, @angular/cli is the case:
  // https://github.com/angular/devkit/blob/v6.0.1/packages/angular_devkit/build_angular/src/karma/index.ts#L65
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

function addPlugin(karmaConfig: ConfigOptions, karmaPlugin: any) {
  karmaConfig.plugins = karmaConfig.plugins || ["karma-*"];
  karmaConfig.plugins.push(karmaPlugin);
}

function configureAngularReporter(config: Config) {
  addPlugin(config, { [`reporter:${AngularReporter.name}`]: ["type", AngularReporter.instance] });
  if (!config.reporters) {
    config.reporters = [];
  }
  config.reporters.push(AngularReporter.name);
}

const globalSettings: {
  karmaConfig?: ConfigOptions;
  karmaConfigFile?: string;
} = {};

export = Object.assign(
  (config: Config) => {
    setDefaultOptions(config);
    disableSingleRun(config);
    setUserKarmaConfigFile(config);
    setUserKarmaConfig(config);
    setBasePath(config);
    setLifeCycleOptions(config);
    configureAngularReporter(config);
  },
  {
    /**
     * Provide global settings for next configuration
     * This is the only way we can pass through any values between the `AngularTestExplorer` and the test-explorer-karma.conf file.
     * (not counting environment variables)
     */
    setGlobals(globals: { karmaConfig?: ConfigOptions; karmaConfigFile?: string }) {
      globalSettings.karmaConfig = globals.karmaConfig;
      globalSettings.karmaConfigFile = globals.karmaConfigFile;
    },
  }
);
