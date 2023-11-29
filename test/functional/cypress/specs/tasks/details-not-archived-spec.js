import { tasks } from '../../../../../src/lib/urls'
import { taskWithInvestmentProjectNotCompleteFaker } from '../../fakers/task'
import { clickButton } from '../../support/actions'
import { assertPayload, assertUrl } from '../../support/assertions'

describe('View task details', () => {
  const investmentProjectTask = taskWithInvestmentProjectNotCompleteFaker()

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
    }
  )
})
