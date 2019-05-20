const selectors = require('../../selectors')

describe('Investment / Invenstor profiles', () => {
  before(() => {
    cy.visit('/investments/profiles')
  })

  it('should display a create a profile button', () => {
    cy.get(selectors.entityCollection.collectionRowButton).should('be.visible')
    cy.get(selectors.entityCollection.collectionRowButton)
      .should('have.attr', 'href', '/investments/profiles/create-investor-profile')
  })

  context('When profiles are available', () => {
    it('should display profiles', () => {
      cy.get(selectors.entityCollection.entities).should('have.length', 1)
    })
  })
})
