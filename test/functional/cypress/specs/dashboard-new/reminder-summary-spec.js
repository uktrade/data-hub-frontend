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
          count: 12,
          investment: {
            estimated_land_date: 1,
            no_recent_interaction: 2,
            outstanding_propositions: 5,
          },
          export: {
            no_recent_interaction: 4,
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

    it('should contain headers', () => {
      cy.get('[data-test="investment-heading"]').should(
        'have.text',
        'Investment'
      )
      cy.get('[data-test="export-heading"]').should('have.text', 'Export')
    })

    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@reminderSummaryHeading').should('contain.text', 'Reminders')
      cy.get('@notificationBadge').should('have.text', '12')
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

      cy.get(
        '[data-test="summary-item-export_no_recent_investment_interaction"]'
      ).contains('Companies with no recent interactions (4)')
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
          export: {
            no_recent_interaction: 0,
          },
        },
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    it('should contain headers', () => {
      cy.get('[data-test="investment-heading"]').should(
        'have.text',
        'Investment'
      )
      cy.get('[data-test="export-heading"]').should('have.text', 'Export')
    })

    it('should contain summary entries', () => {
      cy.get('[data-test="summary-item-estimated_land_date"]').contains(
        'Approaching estimated land dates (0)'
      )
      cy.get(
        '[data-test="summary-item-no_recent_investment_interaction"]'
      ).contains('Projects with no recent interaction (0)')

      cy.get('[data-test="summary-item-outstanding_propositions"]').contains(
        'Outstanding propositions (0)'
      )

      cy.get(
        '[data-test="summary-item-export_no_recent_investment_interaction"]'
      ).contains('Companies with no recent interactions (0)')
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
