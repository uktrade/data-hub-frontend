const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Company OMIS Collections', () => {
  before(() => {
    cy.visit(urls.companies.orders(fixtures.company.oneListCorp.id))
  })

  it('should render a meta title', () => {
    cy.title().should('eq', 'Orders - One List Corp - Companies - DIT Data Hub')
  })

  it('should display a list of orders with the total result', () => {
    cy.get(selectors.entityCollection.collectionResult).should('contain', 264)
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 100)
  })

  it('should display total value of orders', () => {
    cy.get(selectors.entityCollection.totalValue).should(
      'contain',
      '£12,803.29'
    )
  })

  it('should contain status and country badge', () => {
    cy.get(selectors.entityCollection.badge(1, 1)).should('contain', 'Draft')
    cy.get(selectors.entityCollection.badge(1, 2)).should('contain', 'Algeria')
  })

  it('should contain company info', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Samsung')
      .and('contain', '29 Apr 2019')
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
