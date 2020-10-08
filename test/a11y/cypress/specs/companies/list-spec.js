const urls = require('../../../../../src/lib/urls')

describe('My Companies', () => {
  before(() => {
    cy.visit(urls.companies.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
