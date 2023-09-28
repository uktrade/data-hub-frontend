import { tasks, dashboard, companies } from '../../../../../src/lib/urls'
import { investmentProjectTaskFaker } from '../../fakers/task'
import { assertSummaryTable, assertBreadcrumbs } from '../../support/assertions'

describe('View task details', () => {
  const investmentProjectTask = investmentProjectTaskFaker()
  const expectedCompany =
    investmentProjectTask.investmentProjectTask.investmentProject
      .investorCompany

  context('When visiting investment project task details', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      ).as('apiRequest')
      cy.visit(tasks.details(investmentProjectTask.id))
      cy.wait('@apiRequest')
    })

    it('should display the company name and investment project task title in the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard.index(),
        Companies: companies.index(),
        [expectedCompany.name]: companies.detail(expectedCompany.id),
        [investmentProjectTask.title]: null,
      })
    })

    it('should display the title of the investment project task', () => {
      cy.get('h1').contains(investmentProjectTask.title)
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
      })
    })
  })
})
