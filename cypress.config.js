const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 5000,
  requestTimeout: 5000,
  projectId: 'w97se2',

  env: {
    codeCoverage: {
      url: 'http://localhost:3000/__coverage__',
    },
  },
  component: {
    supportFile: 'test/component/cypress/support/index.js',
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require('./test/cypress/plugins/index.js')(on, config)
    },
    specPattern: 'test/functional/cypress/specs/**/*.{js,jsx}',
    baseUrl: 'http://localhost:3000',
    supportFile: 'test/cypress/support/index.js',
  },
  retries: {
    runMode: 2, // number of retries when running `cypress run`
    openMode: 2, // number of retries when running `cypress open`
  },
})
