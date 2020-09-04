const selectors = require('../../../../selectors')

const { dashboard } = require('../../../../../src/lib/urls')

describe('Search', () => {
  before(() => {
    cy.visit(dashboard())

    cy.get(selectors.nav.searchTerm).type('fred').type('{enter}')
  })

  it('should display search navs', () => {
    cy.get(selectors.nav.searchNav)
      .should('contain', 'Companies')
      .and('contain', 'Contacts')
      .and('contain', 'Events')
      .and('contain', 'Interactions')
      .and('contain', 'Investment projects')
      .and('contain', 'Orders')
  })

  it('should display newly created contact in search result', () => {
    cy.get(selectors.collection.header).should(
      'contain',
      '0 results matching fred'
    )

    cy.get(selectors.collection.nav).contains('Contacts').click()

    cy.get(selectors.collection.header).should(
      'contain',
      '1 result matching fred'
    )
  })
})
