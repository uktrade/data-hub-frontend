const urls = require('../../../../src/lib/urls')

describe('community page', () => {
  before(() => {
    cy.viewport(1024, 768)
    cy.visit(urls.community.index())
  })

  it('should render community page correctly', () => {
    cy.get('[data-test="community-roadmap"]').should('be.visible')

    cy.compareSnapshot('community-page')
  })
})
