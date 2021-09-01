const urls = require('../../../../src/lib/urls')

describe('interaction page', () => {
  before(() => {
    cy.intercept('POST', '/api-proxy/v3/search/interaction').as('apiRequest')
    cy.visit(urls.interactions.index())
    cy.wait('@apiRequest')
  })

  it('should render interaction page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('interactionPage')
  })
})
