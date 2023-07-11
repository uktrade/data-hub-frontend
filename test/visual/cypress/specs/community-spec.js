const urls = require('../../../../src/lib/urls')

describe('community page', () => {
  before(() => {
    cy.viewport(1024, 768)
    cy.visit(urls.community.index())
  })

  it('should render community page correctly', () => {
    cy.get('[data-test="market-access-link"]').should('be.visible')
    cy.get('h1').screenshot('community-heading')
    cy.get('p').screenshot('community-paragraph')
    cy.get('img').screenshot('community-image')

    cy.compareSnapshot('community-heading', 0.0)
    cy.compareSnapshot('community-paragraph', 0.0)
    cy.compareSnapshot('community-image', 0.0)
  })
})
