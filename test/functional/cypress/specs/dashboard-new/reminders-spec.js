const { format } = require('date-fns')
const urls = require('../../../../../src/lib/urls')

const UNIVERSITY_PROJECT_CODE = 'DHP-00000004'
const UNIVERSITY_PROJECT_ID = '18750b26-a8c3-41b2-8d3a-fb0b930c2270'
const UNIVERSITY_PROPOSITION_NAME = 'Univeristy Proposition'

describe('Dashboard reminders', () => {
  context('View reminders', () => {
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
        .find('[data-test="toggle-section-button-content"]')
        .as('investmentRemindersHeading')
      cy.get('[data-test="investment-reminders-section"]')
        .find('[data-test="notification-badge"]')
        .as('investmentRemindersBadge')
      cy.get('[data-test="outstanding-propositions-heading"]').as(
        'outstandingPropositionsHeading'
      )
      cy.get('[data-test="outstanding-propositions"]')
        .as('outstandingPropositions')
        .find('[data-test="outstanding-propositions-list"]')
        .as('outstandingPropositionsList')
    })

    it('should contain a notification badge in the reminders heading', () => {
      cy.get('@investmentRemindersHeading').should('contain.text', 'Reminders')
      cy.get('@investmentRemindersBadge').should('have.text', '3')
    })

    it('should contain elements in the correct order', () => {
      cy.get('@investmentReminders')
        .find('[data-test="outstanding-propositions"]')
        .should('have.length', 1)
        .find('[data-test="outstanding-propositions-list"]')
        .should('have.length', 1)
    })

    it('should contain a heading', () => {
      cy.get('@outstandingPropositionsHeading')
        .should('have.text', 'Outstanding propositions (3)')
        .should('have.css', 'color', 'rgb(212, 53, 28)')
    })

    it('should display each of the outstanding propositions', () => {
      cy.get('@outstandingPropositionsList')
        .find('li')
        .should('have.length', '3')
        .first()
        .as('outstandingProposition')

      cy.get('@outstandingProposition')
        .find('a')
        .should('have.text', UNIVERSITY_PROPOSITION_NAME)
        .should(
          'have.attr',
          'href',
          urls.investments.projects.propositions(UNIVERSITY_PROJECT_ID)
        )

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-project-code"]')
        .should('have.text', UNIVERSITY_PROJECT_CODE)

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-deadline"]')
        .should('have.text', `Due ${format(new Date(), 'E, dd MMM yyyy')}`)

      cy.get('@outstandingProposition')
        .find('[data-test="outstanding-proposition-countdown"]')
        .should('have.text', '0 days')
    })
  })

  context('View empty reminders', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.intercept('GET', '/api-proxy/v4/proposition', {
        body: {
          count: 0,
          results: [],
        },
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    after(() => {
      cy.resetUser()
    })

    it('should contain a heading', () => {
      cy.get('[data-test="outstanding-propositions-empty"]')
        .should(
          'have.text',
          'Projects with propositions due soon will be displayed here.'
        )
        .should('have.css', 'color', 'rgb(80, 90, 95)')
    })

    it('should not contain a notification badge in the reminders heading', () => {
      cy.get('[data-test="investment-reminders-section"]')
        .find('[data-test="notification-badge"]')
        .should('not.exist')
    })

    it('should not contain a list', () => {
      cy.get('[data-test="outstanding-propositions-list"]').should('not.exist')
    })
  })

  context('Toggle section', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
      cy.get('[data-test="investment-reminders"]').as('investmentReminders')
      cy.get('[data-test="investment-reminders-section"]')
        .find('[data-test="toggle-section-button"]')
        .as('investmentRemindersToggleButton')
    })

    after(() => {
      cy.resetUser()
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
