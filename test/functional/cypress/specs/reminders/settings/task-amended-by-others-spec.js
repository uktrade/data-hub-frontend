import { assertBreadcrumbs, assertPayload } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const endpoint =
  '/api-proxy/v4/reminder/subscription/my-tasks-task-amended-by-others'

describe('Settings - Task amended by others', () => {
  context('Page breadcrumbs and title', () => {
    before(() => {
      cy.visit(urls.reminders.settings.myTasks.taskAmendedByOthers())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.myTasks.taskAmendedByOthers(),
        Settings: `${urls.reminders.settings.index()}?task_amended_by_others=true`,
        'Task amended by others': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Settings')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Task amended by others'
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
      cy.visit(urls.reminders.settings.myTasks.taskAmendedByOthers())
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
