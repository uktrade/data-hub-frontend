const selectors = require('../../selectors')

describe('Investment Project Collections', () => {
  before(() => {
    cy.visit('/investments/projects')
  })

  it('should display a list of investments', () => {
    cy.get(selectors.entityCollection.entities).children().should('have.length', 10)
  })

  it('should contain investment badge', () => {
    cy.get(selectors.entityCollection.entityBadge(1)).should('contain', 'Won')
    cy.get(selectors.entityCollection.entityBadge(1)).should('contain', 'FDI')
    cy.get(selectors.entityCollection.entityBadge(1)).should('contain', 'ongoing')
  })

  it('should contain investor and sector', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Venus Ltd')
      .and('contain', 'Renewable Energy : Wind : Onshore')
  })
})
