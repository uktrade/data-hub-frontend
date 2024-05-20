const urls = require('../../../../src/lib/urls')

describe('event page', () => {
  before(() => {
    cy.viewport(1024, 768)
    cy.intercept('POST', '/api-proxy/v3/search/event').as('apiRequest')
    cy.visit(urls.events.index())
    cy.wait('@apiRequest')
  })

  it('event page', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('eventPage')
  })
})
