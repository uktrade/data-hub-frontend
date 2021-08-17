const urls = require('../../../../src/lib/urls')

describe('omis page', () => {
  before(() => {
    cy.visit(urls.omis.index())
  })

  it('should render order page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('omisPage')
  })
})
