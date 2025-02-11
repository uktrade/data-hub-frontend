import '@cypress/code-coverage/support'

require('./commands')

Cypress.Keyboard.defaults({
  keystrokeDelay: 5,
})
