const urls = require('../../../../src/lib/urls')

describe('contact page', () => {
  before(() => {
    cy.visit(urls.contacts.index())
  })

  it('should render contact page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('contactPage')
  })
})
