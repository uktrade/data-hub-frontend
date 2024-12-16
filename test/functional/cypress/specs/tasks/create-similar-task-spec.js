import { tasks } from '../../../../../src/lib/urls'
import {
  taskFaker,
  taskWithCompanyFaker,
  taskWithInvestmentProjectFaker,
} from '../../fakers/task'
import { clickButton } from '../../support/actions'
import { fill } from '../../support/form-fillers'
import {
  assertPayload,
  assertFlashMessage,
} from '../../../cypress/support/assertions'
import {
  formatDate,
  DATE_FORMAT_ISO,
} from '../../../../../src/client/utils/date-utils'

describe('Copy task from generic task task', () => {
  const genericTask = taskFaker()

  context('When creating a similar task', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${genericTask.id}`,
        genericTask
      ).as('apiRequest')
      cy.visit(tasks.createCopyTask(genericTask.id))
    })

    it('should save the task with the expected values', () => {
      assertTaskForm(genericTask)
    })
  })
})

describe('Copy task from task with company', () => {
  const taskWithCompany = taskWithCompanyFaker()

  context('When creating a similar task', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${taskWithCompany.id}`,
        taskWithCompany
      ).as('apiRequest')
      cy.visit(tasks.createCopyTask(taskWithCompany.id))
    })

    it('should save the task with the expected values', () => {
      assertTaskForm(taskWithCompany, taskWithCompany.company.id)
    })
  })
})

describe('Copy task from task with investment project', () => {
  const taskWithIP = taskWithInvestmentProjectFaker()

  context('When creating a similar task', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${taskWithIP.id}`, taskWithIP).as(
        'apiRequest'
      )
      cy.visit(tasks.createCopyTask(taskWithIP.id))
    })

    it('should save the task with the expected values', () => {
      assertTaskForm(taskWithIP, null, taskWithIP.investmentProject.id)
    })
  })
})

function assertTaskForm(
  task,
  companyId = null,
  investmentProjectId = null,
  interactionId = null
) {
  cy.intercept('POST', '/api-proxy/v4/task', {
    statusCode: 201,
  }).as('postApiRequest')

  fill('[data-test=field-title]', 'test copy task')
  fill('[data-test=field-description]', 'test copy description')

  clickButton('Save task')

  assertPayload('@postApiRequest', {
    investment_project: investmentProjectId,
    company: companyId,
    interaction: interactionId,
    title: 'test copy task',
    description: 'test copy description',
    due_date: formatDate(task.dueDate, DATE_FORMAT_ISO),
    email_reminders_enabled: task.emailRemindersEnabled,
    reminder_days: task.reminderDays,
    advisers: task.advisers.map((adviser) => adviser.id),
  })
  assertFlashMessage('Task saved')
}
