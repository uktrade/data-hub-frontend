import { investments, tasks } from '../../../../../src/lib/urls'
import {
  assertBreadcrumbs,
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
} from '../../support/assertions'
import { fillWithNewValue } from '../../support/form-fillers'
import { clickButton } from '../../../../functional/cypress/support/actions'
import { taskWithInvestmentProjectFaker } from '../../fakers/task'
import { DATE_LONG_FORMAT_3 } from '../../../../../src/common/constants'
import { format } from '../../../../../src/client/utils/date'

describe('Edit investment project task', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker()
  const endpoint = `/api-proxy/v4/task/${investmentProjectTask.id}`
  const detailsUrl = investments.projects.details(
    investmentProjectTask.investmentProject.id
  )

  context('When visiting the edit task page', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      )
      cy.visit(tasks.edit(investmentProjectTask.id))
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Edit task for ${investmentProjectTask.investmentProject.investorCompany.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Investments: investments.index(),
        Projects: investments.projects.index(),
        [investmentProjectTask.investmentProject.name]: detailsUrl,
        [`Edit task for ${investmentProjectTask.investmentProject.investorCompany.name}`]:
          null,
      })
    })
  })

  context('When editing a task', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      )
      cy.visit(tasks.edit(investmentProjectTask.id))
    })

    it('changing field values should send new values to the api', () => {
      cy.intercept('PATCH', endpoint, {
        statusCode: 200,
      }).as('apiRequest')

      fillWithNewValue('[data-test=title-input]', 'new task')
      fillWithNewValue('[data-test=field-description]', 'new description')

      clickButton('Save task')

      assertPayload('@apiRequest', {
        title: 'new task',
        description: 'new description',
        due_date: format(investmentProjectTask.dueDate, DATE_LONG_FORMAT_3),
        email_reminders_enabled: investmentProjectTask.emailRemindersEnabled,
        investment_project: investmentProjectTask.investmentProject.id,
        reminder_days: investmentProjectTask.reminderDays,
        advisers: investmentProjectTask.advisers.map((a) => a.id),
      })

      assertExactUrl(
        investments.projects.tasks.index(
          investmentProjectTask.investmentProject.id
        )
      )

      assertFlashMessage('Task saved')
    })
  })
})
