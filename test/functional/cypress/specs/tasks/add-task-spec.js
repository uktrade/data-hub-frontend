import { faker } from '@faker-js/faker'

import { investment } from '../../fixtures'
import { investments, tasks, dashboard } from '../../../../../src/lib/urls'
import { id as myAdviserId } from '../../../../sandbox/fixtures/whoami.json'

import {
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
  assertSingleTypeaheadOptionSelected,
  assertVisible,
} from '../../support/assertions'
import {
  fill,
  fillMultiOptionTypeahead,
  fillTypeahead,
} from '../../support/form-fillers'
import { clickButton } from '../../../../functional/cypress/support/actions'
import { companyFaker } from '../../fakers/companies'

const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results

describe('Add generic task', () => {
  context('When visiting the create a task page', () => {
    before(() => {
      cy.visit(tasks.create())
    })

    it('should display the header', () => {
      cy.get('h1').should('have.text', 'Add task')
    })

    context('When a company is selected', () => {
      const company = companyFaker()

      it('should display the investment project typeahead field', () => {
        cy.intercept(`/api-proxy/v4/company?*`, { results: [company] })
        fillTypeahead('[data-test=field-company]', company.name)

        assertVisible('[data-test="field-investmentProject"]')
      })
    })
  })

  context('When creating a task for me', () => {
    before(() => {
      cy.visit(tasks.create())
    })

    it('add task button should send expected values to the api', () => {
      cy.get('[data-test=assigned-to-me]').click()

      assertTaskForm(null, [myAdviserId], null, dashboard.myTasks())
    })
  })

  context('When creating a task for someone else', () => {
    before(() => {
      cy.visit(tasks.create())
    })

    it('add task button should send expected values to the api', () => {
      const advisers = faker.helpers.arrayElements(autoCompleteAdvisers, 2)

      cy.get('[data-test=assigned-to-someone-else]').click()
      fillMultiOptionTypeahead(
        '[data-test=field-advisers]',
        advisers.map((adviser) => adviser.name)
      )

      assertTaskForm(
        null,
        advisers.map((adviser) => adviser.id),
        null,
        dashboard.myTasks()
      )
    })
  })
})

describe('Add investment project task', () => {
  const fixture = investment.investmentWithDetails

  context('When visiting the create a task page', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v3/investment/${fixture.id}`, fixture).as(
        'investmentProjectAPIRequest'
      )
      cy.visit(tasks.createInvestmentProject(fixture.id))
      cy.wait('@investmentProjectAPIRequest')
    })

    it('should display the header', () => {
      cy.get('h1').should('have.text', `Add task for ${fixture.name}`)
    })

    it('should display the company typeahead with the value matching the investment project company', () => {
      assertSingleTypeaheadOptionSelected({
        element: '[data-test="field-company"]',
        expectedOption: fixture.investor_company.name,
      })
    })

    it('should display the investment project typeahead with the select value', () => {
      assertSingleTypeaheadOptionSelected({
        element: '[data-test="field-investmentProject"]',
        expectedOption: fixture.name,
      })
    })

    it('add task button should send expected values to the api', () => {
      cy.get('[data-test=assigned-to-me]').click()

      assertTaskForm(
        fixture.id,
        [myAdviserId],
        null,
        investments.projects.tasks.index(investment.investmentWithDetails.id)
      )
    })
  })
})

describe('Add company task', () => {
  const company = companyFaker()
  context('When visiting the create a task page', () => {
    before(() => {
      cy.visit(tasks.create())
    })

    it('should display the header', () => {
      cy.get('h1').should('have.text', `Add task`)
    })

    it('add task button should send expected values to the api', () => {
      cy.intercept(`/api-proxy/v4/company?*`, { results: [company] })
      cy.get('[data-test=assigned-to-me]').click()
      fillTypeahead('[data-test=field-company]', company.name)
      assertTaskForm(null, [myAdviserId], company.id, dashboard.myTasks())
    })
  })
})

function assertTaskForm(investmentProjectId, advisers, companyId, expectedUrl) {
  cy.intercept('POST', '/api-proxy/v4/task', {
    statusCode: 201,
  }).as('apiRequest')

  fill('[data-test=field-title]', 'test task')
  fill('[data-test=field-description]', 'test description')

  cy.get('[data-test=due-date-custom-date]').click()
  cy.get('[data-test=custom_date-day]').type(25)
  cy.get('[data-test=custom_date-month]').type(12)
  cy.get('[data-test=custom_date-year]').type(3023)

  cy.get('[data-test=field-emailRemindersEnabled]').click()
  cy.get('[data-test=reminder-days-input]').type(1)

  clickButton('Save task')

  assertPayload('@apiRequest', {
    investment_project: investmentProjectId,
    company: companyId,
    title: 'test task',
    description: 'test description',
    due_date: '3023-12-25',
    email_reminders_enabled: true,
    reminder_days: 1,
    advisers: advisers,
  })

  assertExactUrl(expectedUrl)

  assertFlashMessage('Task saved')
}
