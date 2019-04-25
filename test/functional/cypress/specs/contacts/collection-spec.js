const selectors = require('../../selectors')

describe('Contacts Collections', () => {
  before(() => {
    cy.visit('/contacts/?sortby=dummy')
  })

  it('should render breadcrumbs', () => {
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
    cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Contacts')
  })

  it('should display a list of contacts', () => {
    cy.get(selectors.entityCollection.entities).children().should('have.length', 100)
  })

  it('should contain contacts badge', () => {
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Primary')
  })

  it('should contain contacts details', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Royal Haskoning UK Ltd')
      .and('contain', 'Business Group Director, UK')
      .and('contain', 'Environment and Water')
      .and('contain', 'United Kingdom')
      .and('contain', 'East of England')
      .and('contain', '(44) 01733334455')
      .and('contain', 'steven.trewhella@rhdhv.com')
  })
})
