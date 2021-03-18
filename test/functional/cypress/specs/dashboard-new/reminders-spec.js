const { format } = require('date-fns')
const urls = require('../../../../../src/lib/urls')

const NEW_RESTAURANT_PROJECT_CODE = 'DHP-00000004'
const NEW_RESTAURANT_PROJECT_ID = '18750b26-a8c3-41b2-8d3a-fb0b930c2270'
const LIST_OF_CITIES_PROPOSITON_ID = '3322750d-a645-4460-b584-8f9254459246'

describe('Dashboard reminders', () => {
  beforeEach(() => {
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/')
    cy.get('[data-test="investment-reminders"]').as('investmentReminders')
    cy.get('[data-test="investment-reminders-section"]')
      .as('investmentRemindersSection')
      .find('[data-test="toggle-section-button"]')
      .as('investmentRemindersToggleButton')
      .find('[data-test="toggle-section-button-content"]')
      .as('investmentRemindersHeading')
    cy.get('@investmentRemindersSection')
      .find('[data-test="notification-badge"]')
      .as('investmentRemindersBadge')
    cy.get('[data-test="outstanding-propositions"]')
      .as('outstandingPropositions')
      .find('[data-test="outstanding-propositions-list"]')
      .as('outstandingPropositionsList')
  })
  after(() => {
    cy.resetFeatureFlags()
  })

  context('View reminders', () => {
    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@investmentRemindersHeading').should('contain.text', 'Reminders')
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
        .should('have.text', NEW_RESTAURANT_PROJECT_CODE)
        .should(
          'have.attr',
          'href',
          urls.investments.projects.proposition(
            NEW_RESTAURANT_PROJECT_ID,
            LIST_OF_CITIES_PROPOSITON_ID
          )
        )

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-deadline"]')
        .should('have.text', `Due ${format(new Date(), 'dd MMM yyyy')}`)

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-countdown"]')
        .should('have.text', '0 days')
    })
  })

  context('Toggle section', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should be in a togglable section that starts opened', () => {
      cy.get('@investmentReminders').should('be.visible')
      cy.get('@investmentRemindersToggleButton').click()
      cy.get('@investmentReminders').should('not.be.visible')
      cy.get('@investmentRemindersToggleButton').click()
      cy.get('@investmentReminders').should('be.visible')
    })
  })
})
