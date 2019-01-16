// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const AngularReporter = require("./angular-reporter").AngularReporter;

module.exports = function(config) {
  config.set({
    basePath: "/Users/pferraggi/Documents/GitHub/torneo-luefi.web/",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-phantomjs-launcher"),
      require("@angular-devkit/build-angular/plugins/karma"),
      { "reporter:AngularReporter": ["type", AngularReporter] },
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ["progress", "AngularReporter"],
    autoWatch: false,
    browserNoActivityTimeout: 1000000,
    detached: false,
    singleRun: false,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["PhantomJS"],
  });
};
