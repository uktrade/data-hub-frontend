const selectors = require('../../selectors')

describe('Contacts Collections', () => {
  before(() => {
    cy.visit('/contacts')
  })

  it('should display a list of contacts', () => {
    cy.get(selectors.entityList.entities).children().should('have.length', 100)
  })

  it('should contain contacts badge', () => {
    cy.get(selectors.entityList.firstEntityBadge).should('contain', 'Primary')
  })

  it('should contain contacts details', () => {
    cy.get(selectors.entityList.firstEntity)
      .should('contain', 'Royal Haskoning UK Ltd')
      .and('contain', 'Business Group Director, UK')
      .and('contain', 'Environment and Water')
      .and('contain', 'United Kingdom')
      .and('contain', 'East of England')
      .and('contain', '(44) 01733334455')
      .and('contain', 'REPLACED-0002@TEST.HOST')
  })
})
