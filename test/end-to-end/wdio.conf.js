/* eslint-disable */
const IMPLICIT_TIMEOUT = process.env.WDIO_IMPLICIT_TIMEOUT || 90000
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const defaultConfig = {
  specs: [
    './test/end-to-end/src/specs/**/*.js',
  ],
  runner: 'local',
  maxInstances: 10,
  capabilities: [{ 
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080']
      }
  }],
  logLevel: 'error',
  bail: 0,
  baseUrl: BASE_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['selenium-standalone'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    timeout: 60000,
    require: ['@babel/register'],
  },
  before: () => {
    browser.setTimeout({ 'implicit': IMPLICIT_TIMEOUT })
  },
}

exports.config = defaultConfig
