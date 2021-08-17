const urls = require('../../../../src/lib/urls')

describe('event page', () => {
  before(() => {
    cy.visit(urls.events.index())
  })

  it('event page', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('eventPage')
  })
})
