import { capitalize } from 'lodash'

import { investments } from '../../../../../src/lib/urls'
import { id } from '../../../../sandbox/fixtures/whoami.json'

import {
  assertFieldInput,
  assertBreadcrumbs,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
  assertFieldDate,
  assertLink,
} from '../../support/assertions'
import { fillWithNewValue } from '../../support/form-fillers'
import { clickButton } from '../../../../functional/cypress/support/actions'
import { taskWithInvestmentProjectFaker } from '../../fakers/task'
import {
  OPTION_YES,
  OPTION_NO,
  DATE_LONG_FORMAT_3,
} from '../../../../../src/common/constants'
import {
  convertDateToFieldDateObject,
  format,
} from '../../../../../src/client/utils/date'

describe('Edit investment project task', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker()
  const endpoint = `/api-proxy/v4/task/${investmentProjectTask.id}`
  const detailsUrl = investments.projects.details(
    investmentProjectTask.investmentProjectTask.investmentProject.id
  )

  context('When editing a task', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      )
      cy.visit(
        investments.projects.tasks.edit(
          investmentProjectTask.investmentProjectTask.investmentProject.id,
          investmentProjectTask.id
        )
      )
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Edit task for ${investmentProjectTask.investmentProjectTask.investmentProject.investorCompany.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Investments: investments.index(),
        Projects: investments.projects.index(),
        [investmentProjectTask.investmentProjectTask.investmentProject.name]:
          detailsUrl,
        [`Edit task for ${investmentProjectTask.investmentProjectTask.investmentProject.investorCompany.name}`]:
          null,
      })
    })

    it('should display form fields with values matching the loaded task', () => {
      cy.dataTest('field-taskTitle').then((element) => {
        assertFieldInput({
          element,
          label: 'Task title',
          value: investmentProjectTask.title,
        })
      })

      cy.get('[data-test="field-taskDescription"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Task description (optional)',
          hint: 'Add details of the task, especially if you intend to assign it to someone else.',
          value: investmentProjectTask.description,
        })
      })

      cy.get('[data-test="field-customDate"]').then((element) => {
        assertFieldDate({
          element,
          label: 'For example 28 11 2025',
          value: convertDateToFieldDateObject(investmentProjectTask.dueDate),
        })
      })

      cy.get('[data-test="field-taskDueDate"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task due date',
          optionsCount: 7,
        })
      })

      cy.get('[data-test="field-taskRemindersEnabled"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Do you want to set a reminder for this task?',
          optionsCount: 3,
          value: investmentProjectTask.emailRemindersEnabled
            ? capitalize(OPTION_YES)
            : capitalize(OPTION_NO),
        })
      })
    })

    it('should render the cancel button with the correct url', () => {
      assertLink('cancel-button', detailsUrl)
    })

    it('changing field values should send new values to the api', () => {
      cy.intercept('PATCH', endpoint, {
        statusCode: 200,
      }).as('apiRequest')

      fillWithNewValue('[data-test=task-title-input]', 'new task')
      fillWithNewValue('[data-test=field-taskDescription]', 'new description')

      clickButton('Save task')

      assertPayload('@apiRequest', {
        title: 'new task',
        description: 'new description',
        due_date: format(investmentProjectTask.dueDate, DATE_LONG_FORMAT_3),
        email_reminders_enabled: investmentProjectTask.emailRemindersEnabled,
        reminder_days: investmentProjectTask.reminderDays,
        advisers: [id],
      })

      assertExactUrl(detailsUrl)

      assertFlashMessage('Task saved')
    })
  })
})
