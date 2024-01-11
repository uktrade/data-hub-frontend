import { tasks } from '../../../../../src/lib/urls'
import { taskFaker, taskWithCompanyFaker } from '../../fakers/task'
import { clickButton } from '../../support/actions'
import { fillWithNewValue } from '../../support/form-fillers'
import {
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
} from '../../../cypress/support/assertions'

describe('View details for a generic task', () => {
  const task = taskFaker({ archived: false })

  context('When visiting generic task details', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${task.id}`, task).as(
        'apiRequest'
      )
      cy.visit(tasks.details(task.id))
      cy.wait('@apiRequest')
    })

    it('should display the create similar task button', () => {
      cy.get('[data-test="create-similar-task-button"]').should('exist')
    })
  })

  context('When creating a similar task', () => {
    const companyTask = taskWithCompanyFaker({ archived: false })

    context('When visiting a task details', () => {
      before(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/tasks/create?copyTaskId=${companyTask.id}`
        ).as('apiRequest')
        cy.visit(tasks.details(companyTask.id))
        cy.get('[data-test="create-similar-task-button"]').click()
      })

      it('should have all the other fields prefilled from the other task', () => {
        cy.intercept('POST', `/api-proxy/v4/tasks/create`, {
          statusCode: 200,
        }).as('apiPostRequest')

        fillWithNewValue('[data-test=title-input]', 'task copy title')
        fillWithNewValue(
          '[data-test=field-description]',
          'task copy description'
        )

        clickButton('Save task')

        assertPayload('@apiPostRequest', {
          title: 'task copy title',
          description: 'task copy description',
          email_reminders_enabled: companyTask.emailRemindersEnabled,
          investment_project: null,
          company: null,
          reminder_days: companyTask.reminderDays,
          advisers: companyTask.advisers.map((a) => a.id),
          interaction: null,
        })

        assertExactUrl(tasks.details(companyTask.id))

        assertFlashMessage('Task saved')
      })
    })
  })
})
