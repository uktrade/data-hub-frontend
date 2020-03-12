const helper = require('./view-spec-helper')

describe('My companies lists', () => {
  before(() => {
    Cypress.Cookies.preserveOnce('datahub.sid')
    cy.visit('/')
  })

  helper.describeSelectedList({
    name: 'List A',
    ...helper.expectedLists['List A'],
  })
})
