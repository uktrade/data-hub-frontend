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

  it('should display a single order with the total result', () => {
    cy.get(selectors.entityCollection.collectionResult).should('contain', 1)
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 1)
  })

  it('should display total value of orders', () => {
    cy.get(selectors.entityCollection.totalValue).should('contain', '£1,100')
  })

  it('should contain status and country badge', () => {
    cy.get(selectors.entityCollection.badge(1, 1)).should('contain', 'Draft')
    cy.get(selectors.entityCollection.badge(1, 2)).should('contain', 'Serbia')
  })

  it('should contain company info', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Updated on 12 Jul 2021, 4:18pm')
      .and('contain', 'FOOBARBAZ LTD')
      .and('contain', '22 Jun 2021, 12:31pm')
      .and('contain', 'Andy Pipkin')
      .and('contain', 'South East')
      .and('contain', 'Aerospace')
  })

  it('should display Add Order button', () => {
    cy.get(selectors.entityCollection.addOrder)
      .should('be.visible')
      .and('contain', 'Add order')
  })
})
