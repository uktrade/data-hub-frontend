const { formatLongDate } = require('../../../../../src/client/utils/date')
const urls = require('../../../../../src/lib/urls')
const { investmentProjectTaskFaker } = require('../../fakers/task')
const {
  assertSummaryTable,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('View task details', () => {
  const investmentProjectTask = investmentProjectTaskFaker()
  const expextedCompany =
    investmentProjectTask.investment_project_task.investment_project
      .investor_company

  context('When visiting investment project task details', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      ).as('apiRequest')
      cy.visit(urls.tasks.details(investmentProjectTask.id))
      cy.wait('@apiRequest')
    })

    it('should display the company name and investment project task title in the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [expextedCompany.name]: urls.companies.detail(expextedCompany.id),
        [investmentProjectTask.title]: null,
      })
    })

    it('should display the title of the investment project task', () => {
      cy.get('h1').contains(investmentProjectTask.title)
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: {
            href: urls.companies.detail(expextedCompany.id),
            name: expextedCompany.name,
          },
          ['Date due']: formatLongDate(investmentProjectTask.due_date),
          'Assigned to': investmentProjectTask.advisers
            .map((adviser) => adviser.name)
            .join(''),
          'Task description': investmentProjectTask.description,
          'Reminders set': `${investmentProjectTask.reminder_days} days before due date`,
          'Date created': formatLongDate(investmentProjectTask.created_on),
          'Created by': investmentProjectTask.created_by.name,
        },
      })
    })
  })
})
