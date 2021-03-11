const { format } = require('date-fns')
const urls = require('../../../../../src/lib/urls')

const NEW_HOTEL_PROJECT_CODE = 'DHP-00000004'
const NEW_HOTEL_PROJECT_ID = '3322750d-a645-4460-b584-8f9254459246'

describe('Dashboard reminders', () => {
  beforeEach(() => {
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/')
    cy.get('[data-test="investment-reminders"]').as('investmentReminders')
    cy.get('[data-test="investment-reminders-heading"]')
      .as('investmentRemindersHeading')
      .get('[data-test="notification-badge"]')
      .as('investmentRemindersBadge')
    cy.get('[data-test="outstanding-propositions"]')
      .as('outstandingPropositions')
      .get('[data-test="outstanding-propositions-list"]')
      .as('outstandingPropositionsList')
  })
  after(() => {
    cy.resetFeatureFlags()
  })

  context('View reminders', () => {
    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@investmentRemindersHeading').should(
        'contain.text',
        'Reminders 5'
      )
      cy.get('@investmentRemindersBadge').should('have.text', '5')
    })

    it('should contain elements in the correct order', () => {
      cy.get('@investmentReminders')
        .find('[data-test="outstanding-propositions"]')
        .should('have.length', 1)
        .find('[data-test="outstanding-propositions-list"]')
        .should('have.length', 1)
    })

    it('should display each of the outstanding propositions', () => {
      cy.get('@outstandingPropositionsList')
        .find('li')
        .should('have.length', '5')
        .first()
        .as('outstandingProposition')

      cy.get('@outstandingProposition')
        .find('a')
        .should('have.text', NEW_HOTEL_PROJECT_CODE)
        .should(
          'have.attr',
          'href',
          urls.investments.projects.propositions(NEW_HOTEL_PROJECT_ID)
        )

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-deadline"]')
        .should('have.text', `Due ${format(new Date(), 'ddd, DD MMM YYYY')}`)

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-countdown"]')
        .should('have.text', '0 days')
    })
  })
})
