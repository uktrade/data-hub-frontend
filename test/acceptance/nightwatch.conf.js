require('dotenv').config()
const seleniumServer = require('selenium-server')
const chromedriver = require('chromedriver')

require('nightwatch-cucumber')({
  cucumberArgs: [
    '--require', 'test/acceptance/global.js',
    '--require', 'test/acceptance/features/step_definitions',
    '--format', 'pretty',
    '--format', 'json:reports/cucumber.json',
    'test/acceptance/features',
  ],
})

module.exports = {
  output_folder: 'reports',
  page_objects_path: 'test/acceptance/page_objects',
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    log_path: '',
    host: process.env.QA_SELENIUM_HOST,
    port: process.env.QA_SELENIUM_PORT,
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
    },
  },
  test_settings: {
    default: {
      launch_url: '',
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'test/acceptance/screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
      },
    },
  },
}
