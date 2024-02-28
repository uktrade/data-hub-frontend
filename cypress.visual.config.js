const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  video: true,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 5000,
  requestTimeout: 5000,
  projectId: 'w97se2',
  e2e: {
    setupNodeEvents(on, config) {
      const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
      getCompareSnapshotsPlugin(on, config)
      config.env.sandbox_url = process.env.API_ROOT
      return config
    },
    specPattern: 'test/visual/cypress/specs/**/*.js',
    baseUrl: 'http://localhost:3000',
    supportFile: 'test/cypress_visual/support/index.js',
  },
})
