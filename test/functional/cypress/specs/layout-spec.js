const selectors = require('../../../selectors')

describe('Layout', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Navigation', () => {
    it('should display navigation items', () => {
      cy.get(selectors.nav.contact).should('contain', 'Contacts')
      cy.get(selectors.nav.investment).should('contain', 'Investments')
    })
  })

  describe('Search', () => {
    it('should display search form', () => {
      cy.get('input[type="search"]')
        .should('have.attr', 'placeholder', 'Enter your search term(s)')
        .next()
        .should('match', 'button')
        .and('have.text', 'Search')
    })
  })

  describe('React Colours', () => {
    it('should use the same colour palette as the rest of the site', () => {
      cy.contains('Edit list name')
        .focus()
        .should('have.css', 'outline-color', 'rgb(255, 191, 71)')
    })
  })

  describe('Footer', () => {
    it('should display footer', () => {
      cy.get('footer a').should('have.length', 4)
    })
  })
})
