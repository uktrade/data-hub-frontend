const urls = require('../../../../src/lib/urls')

describe('omis page', () => {
  before(() => {
    cy.viewport(1980, 1440)
    cy.intercept('POST', '/api-proxy/v3/search/order').as('apiRequest')
    cy.visit(urls.omis.index())
    cy.wait('@apiRequest')
  })

  it('should render order page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('omisPage')
  })
})
