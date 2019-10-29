const selectors = require('../../../../selectors')

describe('Investment / Invenstor profiles', () => {
  before(() => {
    cy.visit('/investments/profiles')
  })

  context('When no profiles are available', () => {
    it('should not display any profiles', () => {
      cy.get(selectors.entityCollection.entities).should('have.length', 0)
    })

    it('should display a proper message', () => {
      cy.get('#no-profiles').should('be.visible')
    })
  })
})
