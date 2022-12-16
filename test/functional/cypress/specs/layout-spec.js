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
      cy.get('#search-input')
        .should('have.attr', 'placeholder', 'Enter your search term(s)')
        .next()
        .should('match', 'button')
        .and('have.text', 'Submit Search')
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
      cy.get('footer a').should('have.length', 6)
    })
  })
})

describe('When reminders feature flag notification is on', () => {
  beforeEach(() => {
    cy.setUserFeatures(['reminder-summary'])
    cy.visit('/reminders')
  })

  it('should display notification alert badge', () => {
    cy.get('[data-test="notification-alert-badge"]').should('contain', '289')
  })
})

describe('When reminders feature flag notification is off', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display empty notification alert badge', () => {
    cy.get(selectors.nav.headerNav).should('not.contain', 'Notification alert')
  })
})
