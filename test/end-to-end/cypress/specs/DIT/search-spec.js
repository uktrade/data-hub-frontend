const selectors = require('../../../../selectors')

const { dashboard } = require('../../../../../src/lib/urls')

describe('Search', () => {
  before(() => {
    cy.visit(dashboard())

    cy.get('#search-input').type('fred').type('{enter}')
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
})
