import { KarmaConfigurator } from './karma-configurator';
import { Config } from "karma";
import * as path from "path";

const originalConfigPath = path.join(process.cwd(), "src", "karma.conf.js");
const karmaConfigurator = new KarmaConfigurator();

module.exports = (config: Config) =>  {
  karmaConfigurator.loadOriginalUserConfiguration(config, originalConfigPath);
  karmaConfigurator.setMandatoryOptions(config);
  karmaConfigurator.cleanUpReporters(config);
  karmaConfigurator.dontLoadOriginalConfigurationFileIntoBrowser(config, originalConfigPath);
  karmaConfigurator.configureAngularReporter(config);
  karmaConfigurator.setBasePath(config, originalConfigPath);
  karmaConfigurator.disableSingleRunPermanently(config);
};


