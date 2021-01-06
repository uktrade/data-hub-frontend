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

  describe('Tabs', () => {
    it('should display tabs in the right order', () => {
      cy.get('[data-test="dashboard-tabs"]')
        .should('exist')
        .find('[data-test="tablist"]')
        .should('exist')
        .children()
        .should('have.length', 3)
        .first()
        .should('have.text', 'My companies lists')
        .next()
        .should('have.text', 'My referrals')
        .next()
        .should('have.text', 'My pipeline')
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
        .should('have.css', 'outline-color', 'rgb(255, 221, 0)')
    })
  })

  describe('Footer', () => {
    it('should display footer', () => {
      cy.get('footer a').should('have.length', 5)
    })
  })
})
