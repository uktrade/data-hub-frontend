import urls from '../../../../../src/lib/urls'

describe('Dashboard reminders', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-reminders"]').as('investmentReminders')
    cy.get('[data-test="investment-reminders-section"]')
      .as('investmentRemindersSection')
      .find('[data-test="toggle-section-button"]')
      .as('investmentRemindersToggleButton')
      .find('[data-test="toggle-section-button-content"]')
      .as('investmentRemindersHeading')
  })

  context('View reminders', () => {
    beforeEach(() => {
      cy.get('[data-test="notification-badge"]').as('notificationBadge')
    })

    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@investmentRemindersHeading').should('contain.text', 'Reminders')
      cy.get('@notificationBadge').should('have.text', '32')
    })

    it('should count reminder links', () => {
      cy.get('@investmentRemindersToggleButton').click()

      cy.contains('Approaching estimated land dates')
        .should('be.visible')
        .and(
          'have.attr',
          'href',
          urls.reminders.investments.estimatedLandDate()
        )

      cy.contains('Projects with no recent interactions')
        .should('be.visible')
        .and(
          'have.attr',
          'href',
          urls.reminders.investments.noRecentInteraction()
        )

      cy.contains('Outstanding propositions')
        .should('be.visible')
        .and(
          'have.attr',
          'href',
          urls.reminders.investments.outstandingPropositions()
        )
    })

    it('should have reminders count', () => {
      cy.get('[data-testid="investment-eld"]').should('have.text', 14)
      cy.get('[data-testid="investment-nri"]').should('have.text', 15)
      cy.get('[data-testid="investment-op"]').should('have.text', 3)

      cy.get('[data-testid="export-nri"]').should('have.text', 14)
      cy.get('[data-testid="export-ni"]').should('have.text', 14)
    })
  })

  context('Toggle section', () => {
    before(() => {
      cy.visit('/')
    })

    it('should be in a togglable section that starts closed', () => {
      cy.get('@investmentRemindersToggleButton').click()
      cy.get('@investmentReminders').should('be.visible')
      cy.get('@investmentRemindersToggleButton').click()
      cy.get('@investmentReminders').should('not.be.visible')
    })
  })
})
