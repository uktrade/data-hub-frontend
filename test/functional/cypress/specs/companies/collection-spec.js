const selectors = require('../../selectors')

describe('Company Collections', () => {
  before(() => {
    cy.visit('/companies?sortby=collectionTest')
  })

  it('should display a list of companies', () => {
    cy.get(selectors.entityList.entities).children().should('have.length', 9)
  })

  it('should contain country badge', () => {
    cy.get(selectors.entityList.firstEntityBadge).should('contain', 'Malaysia')
  })

  it('should contain company sector and primary address', () => {
    cy.get(selectors.entityList.firstEntity)
      .should('contain', 'Energy')
      .and('contain', 'Level 6, Avenue K Tower, 156 Jalan Ampang, Kuala Lumpur, London, 50450, Malaysia')
  })

  it('should display Add Company button', () => {
    cy.get(selectors.entityCollection.addCompany)
      .should('be.visible')
      .and('contain', 'Add company')
  })
})
