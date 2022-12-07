describe('Dashboard reminder summary', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard', 'reminder-summary'])
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="reminder-summary"]').as('reminderSummary')
    cy.get('[data-test="reminder-summary-section"]')
      .as('reminderSummarySection')
      .find('[data-test="toggle-section-button"]')
      .as('reminderSummaryToggleButton')
      .find('[data-test="toggle-section-button-content"]')
      .as('reminderSummaryHeading')
  })

  context('View reminders', () => {
    before(() => {
      cy.intercept('GET', '/api-proxy/v4/reminder/summary', {
        body: {
          count: 8,
          investment: {
            estimated_land_date: 1,
            no_recent_interaction: 2,
            outstanding_propositions: 5,
          },
        },
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    beforeEach(() => {
      cy.get('[data-test="investment-approaching-estimated-land-dates"]').as(
        'estimatedLandDate'
      )

      cy.get('[data-test="notification-badge"]').as('notificationBadge')
    })

    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@reminderSummaryHeading').should('contain.text', 'Reminders')
      cy.get('@notificationBadge').should('have.text', '8')
    })

    it('should contain elements in the correct order', () => {
      cy.get('@reminderSummary').contains(
        'Approaching estimated land dates (1)Projects with no recent interaction (2)Outstanding propositions (5)Reminders and email notifications settings'
      )
    })

    it('should contain summary entries', () => {
      cy.get(
        '[data-test="investment-approaching-estimated-land-dates"]'
      ).contains('Approaching estimated land dates (1)')
      cy.get(
        '[data-test="investment-projects-with-no-recent-interaction"]'
      ).contains('Projects with no recent interaction (2)')

      cy.get('[data-test="investment-outstanding-propositions"]').contains(
        'Outstanding propositions (5)'
      )
    })

    it('should be in a togglable section that starts open', () => {
      cy.get('@reminderSummaryToggleButton').click()
      cy.get('@reminderSummary').should('not.be.visible')
    })
  })

  context('View empty reminders', () => {
    before(() => {
      cy.intercept('GET', '/api-proxy/v4/reminder/summary', {
        body: {
          count: 0,
          investment: {
            estimated_land_date: 0,
            no_recent_interaction: 0,
            outstanding_propositions: 0,
          },
        },
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    it('should contain a heading', () => {
      cy.get('@reminderSummary').contains(
        'Approaching estimated land dates (0)Projects with no recent interaction (0)Outstanding propositions (0)Reminders and email notifications settings'
      )
    })

    it('should not contain a notification badge in the reminders heading', () => {
      cy.get('[data-test="reminder-summary-section"]')
        .find('[data-test="notification-badge"]')
        .should('not.exist')
    })

    it('should be in a togglable section that starts closed', () => {
      cy.get('@reminderSummaryToggleButton').click()
      cy.get('@reminderSummary').should('be.visible')
    })
  })
})
