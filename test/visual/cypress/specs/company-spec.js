const urls = require('../../../../src/lib/urls')

describe('company page', () => {
  before(() => {
    cy.viewport(1980, 1440)
    cy.intercept('POST', '/v4/search/company').as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')
  })

  it('should render company page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('companyPage')
  })
})
