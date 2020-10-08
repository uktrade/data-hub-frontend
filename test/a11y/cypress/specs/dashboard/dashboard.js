const urls = require('../../../../../src/lib/urls')

describe('Dashboard', () => {
  before(() => {
    cy.visit(urls.dashboard())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
