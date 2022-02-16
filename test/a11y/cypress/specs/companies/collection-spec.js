import urls from '../../../../../src/lib/urls'

describe('Company Collection - React', () => {
  before(() => {
    cy.visit(urls.companies.index())
    // Wait until page has loaded first
    cy.get('h2', { timeout: 20000 }).should('contain.text', 'comp')
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
