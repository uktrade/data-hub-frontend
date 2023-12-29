import { assertBreadcrumbs, assertPayload } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const endpoint = '/api-proxy/v4/reminder/subscription/my-tasks-task-completed'

describe('Settings - task completed', () => {
  context('Page breadcrumbs and title', () => {
    beforeEach(() => {
      cy.visit(urls.reminders.settings.myTasks.taskCompleted())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.myTasks.taskCompleted(),
        Settings: `${urls.reminders.settings.index()}?my_tasks_task_completed=true`,
        'Task completed': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Settings')
      cy.get('[data-test="subheading"]').should('have.text', 'Task completed')
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
      cy.visit(urls.reminders.settings.myTasks.taskCompleted())
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
