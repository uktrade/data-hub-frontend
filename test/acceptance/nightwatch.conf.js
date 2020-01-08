require('dotenv').config()

const chromeDriver = require('chromedriver')
const path = require('path')
const seleniumServer = require('selenium-server')

require('nightwatch-cucumber')({
  cucumberArgs: [
    '--require',
    'test/acceptance/global.cucumber.js',
    '--require',
    'test/acceptance/features',
    '--format',
    'json:cucumber/reports/tests.json',
    process.env.FEATURES_FOLDER || 'test/acceptance/features',
  ],
})

const browserStackUser = process.env.BROWSERSTACK_USERNAME || ''
const browserStackKey = process.env.BROWSERSTACK_ACCESS_KEY || ''
const isRemote = !!process.env.REMOTE_RUN
const isDocker = !!process.env.NIGHTWATCH_IN_DOCKER

const remoteConfig = {
  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80,
  },
  test_settings: {
    ie11: {
      desiredCapabilities: {
        build: 'DataHub - Liveservices',
        browserName: 'IE',
        browser_version: '11',
        os: 'Windows',
        os_version: '10',
        'browserstack.user': browserStackUser,
        'browserstack.key': browserStackKey,
        'browserstack.local': true,
      },
      selenium_host: 'hub-cloud.browserstack.com',
      selenium_port: 80,
    },
    firefox: {
      desiredCapabilities: {
        build: 'DataHub - Liveservices',
        browserName: 'Firefox',
        browser_version: '67.0 beta',
        'browserstack.selenium_version': '3.5.2',
        os: 'Windows',
        os_version: '10',
        'browserstack.user': browserStackUser,
        'browserstack.key': browserStackKey,
        'browserstack.local': true,
      },
      selenium_host: 'hub-cloud.browserstack.com',
      selenium_port: 80,
    },
  },
}

const defaultConfig = {
  custom_commands_path: [
    'node_modules/nightwatch-custom-commands-assertions/js/commands',
    path.resolve(__dirname, 'commands'),
  ],
  custom_assertions_path: [
    'node_modules/nightwatch-custom-commands-assertions/js/assertions',
  ],
  page_objects_path: path.resolve(__dirname, 'pages'),
  globals_path: path.resolve(__dirname, 'global.nightwatch.js'),
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
        path: path.resolve(__dirname, 'screenshots'),
      },
      desiredCapabilities: {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        acceptSslCerts: true,
        javascriptEnabled: true,
        chromeOptions: {
          args: [
            'headless',
            'disable-gpu',
            '--no-sandbox',
            'window-size=1366,768',
          ],
        },
      },
    },
  },
}

const dockerConfig = {
  selenium: {
    start_process: false,
  },
}

module.exports = isRemote
  ? Object.assign({}, defaultConfig, remoteConfig)
  : isDocker
  ? Object.assign({}, defaultConfig, dockerConfig)
  : defaultConfig
