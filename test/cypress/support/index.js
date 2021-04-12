/* eslint-disable */
import '@cypress/code-coverage/support'

require('./commands')

beforeEach(() => {
  cy.resetFeatureFlags()
})

after(() => {
  cy.task('generateReport')
})
