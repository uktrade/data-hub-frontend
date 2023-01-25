const urls = require('../../../../src/lib/urls')

describe('event page', () => {
  before(() => {
    cy.viewport(1024, 768)
    cy.intercept(
      'GET',
      'events/activity/data?sortBy=modified_on:desc&page=1'
    ).as('apiRequest')
    cy.visit(urls.events.index())
    cy.wait('@apiRequest')
  })

  it('event page', () => {
    cy.get('[data-test="aventri-event"]').should('be.visible')
    cy.compareSnapshot('eventPage')
  })
})
