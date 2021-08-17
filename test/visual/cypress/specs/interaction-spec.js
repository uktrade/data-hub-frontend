const urls = require('../../../../src/lib/urls')

describe('interaction page', () => {
  before(() => {
    cy.visit(urls.interactions.index())
  })

  it('should render interaction page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('interactionPage')
  })
})
