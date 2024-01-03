import { assertBreadcrumbs, assertPayload } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const endpoint =
  '/api-proxy/v4/reminder/subscription/my-tasks-due-date-approaching'

describe('Settings - my tasks upcoming due dates', () => {
  context('Page breadcrumbs and title', () => {
    before(() => {
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.myTasks.dueDateApproaching(),
        Settings: `${urls.reminders.settings.index()}?my_tasks_due_date_approaching=true`,
        'Due date approaching': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Settings')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Due date approaching'
      )
    })
  })

  context('Form submission', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          email_reminders_enabled: true,
        },
      }).as('getSettings')
      cy.intercept('PATCH', endpoint).as('saveSettings')
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
      cy.wait('@getSettings')
    })

    it('should render a "Settings updated" banner', () => {
      cy.get(`[data-test="submit-button"]`).click()
      assertPayload('@saveSettings', {
        email_reminders_enabled: true,
      })
      cy.get('[data-test="flash"]').should('have.text', 'Settings updated')
    })
  })
})
