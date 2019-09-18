const selectors = require('../../../../selectors')

describe('Company Collections', () => {
  before(() => {
    cy.visit('/companies?sortby=collectionTest')
  })

  it('should render breadcrumbs', () => {
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
    cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Companies')
  })

  it('should display a list of companies', () => {
    cy.get(selectors.entityCollection.entities).children().should('have.length', 9)
  })

  it('should contain country badge', () => {
    cy.get(selectors.entityCollection.entityBadge(1)).should('contain', 'Malaysia')
  })

  it('should contain company sector and primary address', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Energy')
      .and('contain', 'Level 6, Avenue K Tower, 156 Jalan Ampang, Kuala Lumpur, 50450, Malaysia')
  })

  it('should display Add Company button', () => {
    cy.get(selectors.entityCollection.addCompany)
      .should('be.visible')
      .and('contain', 'Add company')
  })
})
