const urls = require('../../../../src/lib/urls')

describe('contact page', () => {
  before(() => {
    cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
    cy.visit(urls.contacts.index())
    cy.wait('@apiRequest')
  })

  it('should render contact page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('contactPage')
  })
})
