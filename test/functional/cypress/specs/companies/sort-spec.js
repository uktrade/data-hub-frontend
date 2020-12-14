const selectors = require('../../../../selectors')

describe('Company Collections Sort', () => {
  beforeEach(() => {
    cy.intercept('/companies').as('sortResults')
    cy.visit('/companies?sortby=collectionTest')
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 9)
    cy.get(selectors.entityCollection.collection).should(
      'contain',
      '100,172 companies'
    )
  })

  it('should sort by AZ', () => {
    cy.get(selectors.entityCollection.sort).select('name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=name:asc')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'SortByAZ')
  })

  it('should sort by least recent', () => {
    cy.get(selectors.entityCollection.sort).select('modified_on:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=modified_on:asc')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should(
      'contain',
      'SortByLeastRecent'
    )
  })

  it('should sort by most recent', () => {
    cy.get(selectors.entityCollection.sort).select('modified_on:desc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=modified_on:desc')
    })

    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 2)
    cy.get(selectors.entityCollection.entity(1)).should(
      'contain',
      'SortByMostRecent'
    )
  })
})
