import { tasks, dashboard, companies } from '../../../../../src/lib/urls'
import {
  taskWithInvestmentProjectFaker,
  taskWithInvestmentProjectNotCompleteFaker,
} from '../../fakers/task'
import {
  assertSummaryTable,
  assertBreadcrumbs,
  assertPayload,
  assertUrl,
} from '../../support/assertions'
import { clickButton } from '../../support/actions'

describe('View details for task that is assigned to an investment project', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker()
  const investmentProjectTaskCompleted = taskWithInvestmentProjectFaker({
    archived: true,
  })

  taskWithInvestmentProjectNotCompleteFaker()

  context('When visiting a completed task details', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTaskCompleted.id}`,
        investmentProjectTaskCompleted
      ).as('apiRequest')
      cy.visit(tasks.details(investmentProjectTaskCompleted.id))
      cy.wait('@apiRequest')
    })

    it('should display the company name and investment project task title in the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard.index(),
        Companies: companies.index(),
        [investmentProjectTaskCompleted.company.name]: companies.detail(
          investmentProjectTaskCompleted.company.id
        ),
        [investmentProjectTaskCompleted.title]: null,
      })
    })

    it('should display the title of the investment project task and completed tag', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        investmentProjectTaskCompleted.title
      )

      cy.get('[data-test="activity-kind-label"]').should('contain', 'COMPLETED')
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
      })
    })
  })

  context('When visiting a not complete task details', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${investmentProjectTask.id}`,
        investmentProjectTask
      ).as('apiRequest')
      cy.visit(tasks.details(investmentProjectTask.id))
      cy.wait('@apiRequest')
    })

    it('should redirect to the investment project and show the Flash message after marking as complete', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/task/${investmentProjectTask.id}/archive`,
        {}
      ).as('postTaskArchiveApiRequest')
      clickButton('Mark as complete')
      assertPayload('@postTaskArchiveApiRequest', { reason: 'completed' })
      assertUrl(
        `/investments/projects/${investmentProjectTask.investmentProject.id}/tasks`
      )
    })
  })
})
