import { KarmaConfigurator } from "./karma-configurator";
import { Config } from "karma";
// import * as path from "path";

// let originalConfigPath = path.join(process.cwd(), "src", "karma.conf.js");
const karmaConfigurator = new KarmaConfigurator();
global.console.log(process.env.userKarmaConfigPath);
const originalConfigPath = process.env.userKarmaConfigPath as string;

// const setupCorrectKarmaConfFilePath = () => {
//   try {
//      require.resolve(originalConfigPath);
//   } catch (error) {
//      originalConfigPath = path.join(process.cwd(), "karma.conf.js");
//   }
// };

module.exports = (config: Config) =>  {
  // setupCorrectKarmaConfFilePath();
  karmaConfigurator.loadOriginalUserConfiguration(config, originalConfigPath);
  karmaConfigurator.setMandatoryOptions(config);
  karmaConfigurator.cleanUpReporters(config);
  karmaConfigurator.dontLoadOriginalConfigurationFileIntoBrowser(config, originalConfigPath);
  karmaConfigurator.configureTestExplorerCustomReporter(config);
  karmaConfigurator.setBasePath(config, originalConfigPath);
  karmaConfigurator.disableSingleRunPermanently(config);
};
