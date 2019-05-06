import { KarmaConfigurator } from "./karma-configurator";
import { Config } from "karma";

const karmaConfigurator = new KarmaConfigurator();
const originalConfigPath = process.env.userKarmaConfigPath as string;

module.exports = (config: Config) => {
  karmaConfigurator.loadOriginalUserConfiguration(config, originalConfigPath);
  karmaConfigurator.setMandatoryOptions(config);
  karmaConfigurator.cleanUpReporters(config);
  karmaConfigurator.dontLoadOriginalConfigurationFileIntoBrowser(config, originalConfigPath);
  karmaConfigurator.configureTestExplorerCustomReporter(config);
  karmaConfigurator.setBasePath(config, originalConfigPath);
  karmaConfigurator.disableSingleRunPermanently(config);
};
