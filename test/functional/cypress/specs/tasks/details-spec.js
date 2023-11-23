import { tasks, dashboard, companies } from '../../../../../src/lib/urls'
import { taskWithInvestmentProjectFaker } from '../../fakers/task'
import { assertSummaryTable, assertBreadcrumbs } from '../../support/assertions'

describe('View task details', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker()

  const expectedCompany =
    investmentProjectTask.investmentProject.investorCompany

  context(
    'When visiting task details that is assigned to an investment project',
    () => {
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

      it('should display the title of the investment project task and completed tag', () => {
        cy.get('h1')
          .contains(investmentProjectTask.title)
          .find('[data-test="activity-kind-label"]')
          .should('contain', 'COMPLETED')
      })

      it('should display the summary table', () => {
        assertSummaryTable({
          dataTest: 'task-details-table',
        })
      })
    }
  )
})
