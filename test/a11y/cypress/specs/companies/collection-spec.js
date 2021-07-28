import urls from '../../../../../src/lib/urls'

describe('Company Collection - React', () => {
  before(() => {
    cy.visit(urls.companies.index())
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
