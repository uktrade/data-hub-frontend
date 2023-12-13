import {
  companies,
  dashboard,
  investments,
  tasks,
} from '../../../../../src/lib/urls'
import {
  assertBreadcrumbs,
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
  assertSingleTypeaheadOptionSelected,
} from '../../support/assertions'
import { fillWithNewValue } from '../../support/form-fillers'
import { clickButton } from '../../../../functional/cypress/support/actions'
import {
  taskFaker,
  taskWithCompanyFaker,
  taskWithInvestmentProjectFaker,
} from '../../fakers/task'
import { DATE_LONG_FORMAT_3 } from '../../../../../src/common/constants'
import { format } from '../../../../../src/client/utils/date'

describe('Edit generic task', () => {
  const task = taskFaker()
  const endpoint = `/api-proxy/v4/task/${task.id}`
  const detailsUrl = tasks.details(task.id)

  context('When visiting the edit task page', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${task.id}`, task)
      cy.visit(tasks.edit(task.id))
    })

    it('should display the header', () => {
      cy.get('h1').should('have.text', `Edit task for ${task.title}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard.myTasks(),
        [task.title]: detailsUrl,
        Task: null,
      })
    })
  })

  context('When editing a task', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${task.id}`, task)
      cy.visit(tasks.edit(task.id))
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
        due_date: format(task.dueDate, DATE_LONG_FORMAT_3),
        email_reminders_enabled: task.emailRemindersEnabled,
        investment_project: null,
        company: null,
        reminder_days: task.reminderDays,
        advisers: task.advisers.map((a) => a.id),
      })

      assertExactUrl(tasks.details(task.id))

      assertFlashMessage('Task saved')
    })
  })
})

describe('Edit investment project task', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker()
  const endpoint = `/api-proxy/v4/task/${investmentProjectTask.id}`
  const detailsUrl = investments.projects.tasks.index(
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
        Home: dashboard.myTasks(),
        Investments: investments.index(),
        Projects: investments.projects.index(),
        [investmentProjectTask.investmentProject.name]: detailsUrl,
        Task: null,
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
        company: null,
        investment_project: investmentProjectTask.investmentProject.id,
        reminder_days: investmentProjectTask.reminderDays,
        advisers: investmentProjectTask.advisers.map((a) => a.id),
      })

      assertExactUrl(tasks.details(investmentProjectTask.id))

      assertFlashMessage('Task saved')
    })
  })
})

describe('Edit company task', () => {
  const companyTask = taskWithCompanyFaker()
  const endpoint = `/api-proxy/v4/task/${companyTask.id}`
  const detailsUrl = companies.detail(companyTask.company.id)

  context('When visiting the edit task page', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${companyTask.id}`, companyTask)
      cy.visit(tasks.edit(companyTask.id))
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Edit task for ${companyTask.company.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard.myTasks(),
        Companies: companies.index(),
        [companyTask.company.name]: detailsUrl,
        Task: null,
      })
    })

    it('should show the current company pre selected', () => {
      assertSingleTypeaheadOptionSelected({
        element: '[data-test="field-company"]',
        expectedOption: companyTask.company.name,
      })
    })
  })

  context('When editing a task', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${companyTask.id}`, companyTask)
      cy.visit(tasks.edit(companyTask.id))
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
        due_date: format(companyTask.dueDate, DATE_LONG_FORMAT_3),
        email_reminders_enabled: companyTask.emailRemindersEnabled,
        investment_project: null,
        company: companyTask.company.id,
        reminder_days: companyTask.reminderDays,
        advisers: companyTask.advisers.map((a) => a.id),
      })

      assertExactUrl(tasks.details(companyTask.id))

      assertFlashMessage('Task saved')
    })
  })
})
