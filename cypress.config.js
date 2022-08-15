const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true,
  videoUploadOnPasses: false,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 5000,
  requestTimeout: 5000,
  projectId: 'w97se2',

  env: {
    codeCoverage: {
      url: 'http://localhost:3000/__coverage__',
    },
  },

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./test/cypress/plugins/index.js')(on, config)
    },
    specPattern: 'test/functional/cypress/specs/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3000',
    supportFile: 'test/cypress/support/index.js',
  },

  component: {
    setupNodeEvents(on, config) {
      return require('./test/cypress/plugins/index.js')(on, config)
    },
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'test/component/cypress/specs/**/*.cy.{js,jsx,ts,tsx}',
  },
})
