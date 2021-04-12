/* eslint-disable */
import '@cypress/code-coverage/support'

require('./commands')

after(() => {
  cy.task('generateReport')
})
