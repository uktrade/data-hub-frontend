/* eslint-disable */
import '@cypress/code-coverage/support'
import 'cypress-axe'

require('./commands')

after(() => {
  cy.task('generateReport')
})
