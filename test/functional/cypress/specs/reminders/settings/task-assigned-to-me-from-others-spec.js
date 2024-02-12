import { assertBreadcrumbs, assertPayload } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const endpoint =
  '/api-proxy/v4/reminder/subscription/my-tasks-task-assigned-to-me-from-others'

describe('Settings - task assigned to me from others', () => {
  context('Page breadcrumbs and title', () => {
    beforeEach(() => {
      cy.visit(urls.reminders.settings.myTasks.taskAssignedToMeFromOthers())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.myTasks.taskAssignedToMeFromOthers(),
        Settings: `${urls.reminders.settings.index()}?my_tasks_task_assigned_to_me_from_others=true`,
        'Task assigned to me from others': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Settings')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Task assigned to me from others'
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
      cy.visit(urls.reminders.settings.myTasks.taskAssignedToMeFromOthers())
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
