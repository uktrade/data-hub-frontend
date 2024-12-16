import { tasks } from '../../../../../src/lib/urls'
import {
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
  assertSingleTypeaheadOptionSelected,
  assertVisible,
} from '../../support/assertions'
import { fillTypeahead, fillWithNewValue } from '../../support/form-fillers'
import { clickButton } from '../../../../functional/cypress/support/actions'
import {
  taskFaker,
  taskWithCompanyFaker,
  taskWithInvestmentProjectFaker,
} from '../../fakers/task'
import {
  formatDate,
  DATE_FORMAT_ISO,
} from '../../../../../src/client/utils/date-utils'
import { companyFaker } from '../../fakers/companies'
import { investmentProjectFaker } from '../../fakers/investment-projects'

describe('Edit generic task', () => {
  const task = taskFaker()
  const endpoint = `/api-proxy/v4/task/${task.id}`

  context('When visiting the edit task page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${task.id}`, task)
      cy.visit(tasks.edit(task.id))
    })

    it('should display the header', () => {
      cy.get('h1').should('have.text', `Edit task for ${task.title}`)
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
        due_date: formatDate(task.dueDate, DATE_FORMAT_ISO),
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

describe('Edit investment project task', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker()
  const endpoint = `/api-proxy/v4/task/${investmentProjectTask.id}`

  context('When visiting the edit task page', () => {
    beforeEach(() => {
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

    it('should display the company typeahead with the value matching the investment project company', () => {
      assertSingleTypeaheadOptionSelected({
        element: '[data-test="field-company"]',
        expectedOption:
          investmentProjectTask.investmentProject.investorCompany.name,
      })
    })

    it('should display the investment project typeahead with the value matching the investment project', () => {
      assertSingleTypeaheadOptionSelected({
        element: '[data-test="field-investmentProject"]',
        expectedOption: investmentProjectTask.investmentProject.name,
      })
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
        due_date: formatDate(investmentProjectTask.dueDate, DATE_FORMAT_ISO),
        email_reminders_enabled: investmentProjectTask.emailRemindersEnabled,
        company: null,
        investment_project: investmentProjectTask.investmentProject.id,
        reminder_days: investmentProjectTask.reminderDays,
        advisers: investmentProjectTask.advisers.map((a) => a.id),
        interaction: null,
      })

      assertExactUrl(tasks.details(investmentProjectTask.id))

      assertFlashMessage('Task saved')
    })
  })

  context(
    'When changing the company from one without investment projects to one with investment projects',
    () => {
      const company = companyFaker()

      before(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/task/${investmentProjectTask.id}`,
          investmentProjectTask
        )

        cy.intercept(`/api-proxy/v3/search/investment_project`, (req) => {
          if (
            req.body.investor_company.includes(
              investmentProjectTask.investmentProject.investorCompany.id
            )
          ) {
            req.reply({ results: [] })
          } else {
            req.reply({ results: [investmentProjectTask.investmentProject] })
          }
        }).as('companyProjectSearch')

        cy.visit(tasks.edit(investmentProjectTask.id))
      })

      it('should show the investments project field when company is changed', () => {
        cy.intercept(`/api-proxy/v4/company?*`, { results: [company] })
        fillTypeahead('[data-test=field-company]', company.name)
        cy.wait('@companyProjectSearch')
        assertVisible('[data-test="field-investmentProject"]')
        fillTypeahead(
          '[data-test=field-investmentProject]',
          investmentProjectTask.investmentProject.name
        )
      })
    }
  )

  context('When changing the company and the investment project', () => {
    const company = companyFaker()
    const newInvestmentProject = investmentProjectFaker({
      investor_company: company,
    })

    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      )

      cy.intercept(`/api-proxy/v3/search/investment_project`, (req) => {
        if (
          req.body.investor_company.includes(
            investmentProjectTask.investmentProject.investorCompany.id
          )
        ) {
          req.reply({ results: [investmentProjectTask.investmentProject] })
        } else {
          req.reply({ results: [newInvestmentProject] })
        }
      }).as('companyProjectSearch')

      cy.visit(tasks.edit(investmentProjectTask.id))
    })

    it('should display the new values in the typeaheads', () => {
      cy.intercept(`/api-proxy/v4/company?*`, { results: [company] })

      assertSingleTypeaheadOptionSelected({
        element: '[data-test=field-company]',
        expectedOption: investmentProjectTask.company.name,
      })
      assertSingleTypeaheadOptionSelected({
        element: '[data-test=field-investmentProject]',
        expectedOption: investmentProjectTask.investmentProject.name,
      })

      fillTypeahead('[data-test=field-company]', company.name)
      cy.wait('@companyProjectSearch')
      fillTypeahead(
        '[data-test=field-investmentProject]',
        newInvestmentProject.name
      )
    })
  })
})

describe('Edit company task', () => {
  const companyTask = taskWithCompanyFaker()
  const endpoint = `/api-proxy/v4/task/${companyTask.id}`

  context('When visiting the edit task page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${companyTask.id}`, companyTask)
      cy.visit(tasks.edit(companyTask.id))
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Edit task for ${companyTask.company.name}`
      )
    })

    it('should show the current company pre selected', () => {
      assertSingleTypeaheadOptionSelected({
        element: '[data-test="field-company"]',
        expectedOption: companyTask.company.name,
      })
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
        due_date: formatDate(companyTask.dueDate, DATE_FORMAT_ISO),
        email_reminders_enabled: companyTask.emailRemindersEnabled,
        investment_project: null,
        company: companyTask.company.id,
        reminder_days: companyTask.reminderDays,
        advisers: companyTask.advisers.map((a) => a.id),
        interaction: null,
      })

      assertExactUrl(tasks.details(companyTask.id))

      assertFlashMessage('Task saved')
    })
  })
})
