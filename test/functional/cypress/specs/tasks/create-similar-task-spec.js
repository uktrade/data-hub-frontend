import { tasks } from '../../../../../src/lib/urls'
import { taskFaker } from '../../fakers/task'
import { assertPayload } from '../../support/assertions'
import { clickButton } from '../../support/actions'

describe('View details for a generic task', () => {
  const task = taskFaker({ archived: false })
  const endpoint = `/api-proxy/v4/tasks/create?copyTaskId=${task.id}`

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
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/tasks/create?copyTaskId=${task.id}`,
        task
      ).as('apiRequest')
      cy.visit(tasks.createCopyTask(task.id))
      cy.wait('@apiRequest')
    })

    it('should have all the other fields prefilled from the other task', () => {
      cy.intercept('POST', endpoint, {
        statusCode: 200,
      }).as('apiRequest')

      fillWithNewValue('[data-test=title-input]', 'task copy title')
      fillWithNewValue('[data-test=field-description]', 'task copy description')

      clickButton('Save task')

      assertPayload('@apiRequest', {
        title: 'task copy title',
        description: 'tasck copy description',
        due_date: format(task.dueDate, DATE_LONG_FORMAT_3),
        email_reminders_enabled: task.emailRemindersEnabled,
        investment_project: null,
        company: null,
        reminder_days: task.reminderDays,
        advisers: task.advisers.map((a) => a.id),
        interaction: null,
      })

      assertExactUrl(tasks.details(task.id))

      assertFlashMessage('Task saved')
    })
  })
})
