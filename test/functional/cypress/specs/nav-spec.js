const selectors = require('../../../selectors')

describe('Data hub homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display navigation items', () => {
    cy.get(selectors.nav.contact).should('contain', 'Contacts')
    cy.get(selectors.nav.investment).should('contain', 'Investments')
  })
})
