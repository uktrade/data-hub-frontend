require('dotenv').config()
const seleniumServer = require('selenium-server')
const chromeDriver = require('chromedriver')
const glob = require('glob')
const { join } = require('path')

require('nightwatch-cucumber')({
  cucumberArgs: [
    '--require', 'test/acceptance/global.cucumber.js',
    '--require', 'test/acceptance/features',
    '--format', 'json:cucumber/reports/tests.json',
    process.env.FEATURES_FOLDER || 'test/acceptance/features',
  ],
})

module.exports = {
  custom_commands_path: 'test/acceptance/commands',
  page_objects_path: glob.sync(join(__dirname, 'features/**/page-objects')),
  globals_path: 'test/acceptance/global.nightwatch.js',
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    host: process.env.QA_SELENIUM_HOST,
    port: process.env.QA_SELENIUM_PORT,
    cli_args: {
      'webdriver.chrome.driver': chromeDriver.path,
    },
  },
  test_settings: {
    default: {
      launch_url: '',
      desiredCapabilities: {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        javascriptEnabled: true,
      },
    },
    circleci: {
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'test/acceptance/screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        javascriptEnabled: true,
        chromeOptions: {
          args: [
            'headless',
            'disable-gpu',
          ],
        },
      },
    },
  },
}
