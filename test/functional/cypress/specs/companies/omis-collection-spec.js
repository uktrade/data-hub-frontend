const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Company OMIS Collections', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.default.id}/orders`)
  })

  it('should display a list of orders with the total result', () => {
    cy.get(selectors.entityCollection.collectionResult).should('contain', 264)
    cy.get(selectors.entityCollection.entities).children().should('have.length', 100)
  })

  it('should display total value of orders', () => {
    cy.get(selectors.entityCollection.totalValue).should('contain', '£12,803.29')
  })

  it('should contain status and country badge', () => {
    cy.get(selectors.entityCollection.badge(1, 1)).should('contain', 'Draft')
    cy.get(selectors.entityCollection.badge(1, 2)).should('contain', 'Algeria')
  })

  it('should contain company info', () => {
    cy.scrollTo(0, 500)
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Samsung')
      .and('contain', '29 Apr 2019, 3:25pm')
      .and('contain', 'Alysia Tolley')
      .and('contain', 'Yorkshire and The Humber')
      .and('contain', 'ICT')
  })

  it('should display Add Order button', () => {
    cy.get(selectors.entityCollection.addOrder)
      .should('be.visible')
      .and('contain', 'Add order')
  })
})
