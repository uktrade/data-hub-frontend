import { investment } from '../../fixtures'
import { investments } from '../../../../../src/lib/urls'
import { id as _id } from '../../../../sandbox/fixtures/whoami.json'

import {
  assertBreadcrumbs,
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
} from '../../support/assertions'
import { fill } from '../../support/form-fillers'
import { clickButton } from '../../../../functional/cypress/support/actions'

describe('Add investment project task', () => {
  const fixture = investment.investmentWithDetails
  const endpoint = '/api-proxy/v4/investmentprojecttask'
  const detailsUrl = investments.projects.details(fixture.id)

  context('When creating a task', () => {
    before(() => {
      cy.visit(
        investments.projects.tasks.create(investment.investmentWithDetails.id)
      )
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Add task for ${fixture.investor_company.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Investments: investments.index(),
        Projects: investments.projects.index(),
        [fixture.name]: detailsUrl,
        [`Add task for ${fixture.investor_company.name}`]: null,
      })
    })

    it('add task button should send expected values to the api', () => {
      cy.intercept('POST', endpoint, {
        statusCode: 201,
      }).as('apiRequest')

      fill('[data-test=field-taskTitle]', 'test task')
      fill('[data-test=field-taskDescription]', 'test description')

      cy.get('[data-test=task-due-date-custom-date]').click()
      cy.get('[data-test=custom_date-day]').type(25)
      cy.get('[data-test=custom_date-month]').type(12)
      cy.get('[data-test=custom_date-year]').type(3023)

      cy.get('[data-test=field-taskRemindersEnabled]').click()
      cy.get('[data-test=task-reminder-days-input]').type(1)

      clickButton('Save task')

      assertPayload('@apiRequest', {
        investment_project: {
          id: fixture.id,
          name: fixture.name,
        },
        task: {
          title: 'test task',
          description: 'test description',
          due_date: '3023-12-25',
          email_reminders_enabled: true,
          reminder_days: 1,
          advisers: [_id],
        },
      })

      assertExactUrl(
        investments.projects.tasks.index(investment.investmentWithDetails.id)
      )

      assertFlashMessage('Task saved')
    })
  })
})
