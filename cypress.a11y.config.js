const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 5000,
  requestTimeout: 5000,
  projectId: 'w97se2',
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          /* eslint-disable no-console */
          console.log(message)
          /* eslint-enable no-console */
          return null
        },
      })
    },
    specPattern: 'test/a11y/cypress/specs/e2e/*.spec.js',
    baseUrl: 'http://localhost:3000',
    supportFile: 'test/a11y/support/index.js',
  },
  component: {
    specPattern: 'test/a11y/cypress/specs/component/**/*.{js,jsx}',
    supportFile: 'test/component/cypress/support/index.js',
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
})
