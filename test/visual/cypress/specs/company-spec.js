const urls = require('../../../../src/lib/urls')

describe('company page', () => {
  before(() => {
    cy.intercept('POST', '/api-proxy/v4/search/company').as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')
  })

  it('should render company page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('companyPage')
  })
})
