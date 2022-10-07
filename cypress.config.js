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
    setupNodeEvents(on, config) {
      return require('./test/cypress/plugins/index.js')(on, config)
    },
    specPattern: 'test/functional/cypress/specs/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3000',
    supportFile: 'test/cypress/support/index.js',
  },
  component: {
    setupNodeEvents() {},
    specPattern: 'test/component/cypress/specs/**/*.cy.{js,jsx,ts,tsx}',
  },
})
