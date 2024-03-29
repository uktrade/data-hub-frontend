import { tasks, dashboard } from '../../../../../src/lib/urls'
import {
  taskFaker,
  taskWithCompanyFaker,
  taskWithInvestmentProjectFaker,
} from '../../fakers/task'
import {
  assertSummaryTable,
  assertBreadcrumbs,
  assertPayload,
  assertUrl,
} from '../../support/assertions'
import { clickButton } from '../../support/actions'
import interactionsListFaker from '../../fakers/interactions'
import { STATUS } from '../../../../../src/client/modules/Tasks/TaskForm/constants'

describe('View details for a generic task', () => {
  const genericTaskCompleted = taskFaker({ status: STATUS.COMPLETED })
  const genericTaskNotCompleteTask = taskFaker({ status: STATUS.ACTIVE })
  const generticTaskArchived = taskFaker({ archived: true })

  context('When visiting a completed task details', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${genericTaskCompleted.id}`,
        genericTaskCompleted
      ).as('apiRequest')
      cy.visit(tasks.details(genericTaskCompleted.id))
      cy.wait('@apiRequest')
    })

    it('should display the task title in the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard.myTasks(),
        [genericTaskCompleted.title]: tasks.details(genericTaskCompleted.id),
        Task: null,
      })
    })

    it('should display the title of the task and completed tag', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        genericTaskCompleted.title
      )

      cy.get('[data-test="activity-kind-label"]').should('contain', 'COMPLETED')
      cy.get('[data-test="activity-kind-label"]').should(
        'not.contain',
        'DELETED'
      )
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
      })
    })
  })

  context('When visiting an archived task details', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${generticTaskArchived.id}`,
        generticTaskArchived
      ).as('apiRequest')
      cy.visit(tasks.details(generticTaskArchived.id))
      cy.wait('@apiRequest')
    })

    it('should display the task title in the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: dashboard.myTasks(),
        [generticTaskArchived.title]: tasks.details(generticTaskArchived.id),
        Task: null,
      })
    })

    it('should display the title of the task and deleted tag', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        generticTaskArchived.title
      )

      cy.get('[data-test="activity-kind-label"]').should('contain', 'DELETED')
      cy.get('[data-test="activity-kind-label"]').should(
        'not.contain',
        'COMPLETED'
      )
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
      })
    })
  })

  context('When visiting a not complete not archived task details', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${genericTaskNotCompleteTask.id}`,
        genericTaskNotCompleteTask
      ).as('apiRequest')
      cy.visit(tasks.details(genericTaskNotCompleteTask.id))
      cy.wait('@apiRequest')
    })

    it('should display the title of the task without a completed tag', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        genericTaskNotCompleteTask.title
      )

      cy.get('[data-test="activity-kind-label"]').should('not.exist')
    })

    it('should redirect to the dashboard and show the Flash message after deleting', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/task/${genericTaskNotCompleteTask.id}/archive`,
        {}
      ).as('postTaskArchiveApiRequest')
      clickButton('Delete task')
      assertPayload('@postTaskArchiveApiRequest', { reason: 'deleted' })
      assertUrl(dashboard.myTasks())
    })

    it('should redirect to the dashboard and show the Flash message after marking as complete', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/task/${genericTaskNotCompleteTask.id}/status-complete`,
        {}
      ).as('postTaskStatusCompleteApiRequest')
      clickButton('Mark as complete')
      cy.wait('@postTaskStatusCompleteApiRequest')
      assertUrl(dashboard.myTasks())
    })
  })
})

describe('View details for task that is assigned to an investment project', () => {
  const investmentProjectTask = taskWithInvestmentProjectFaker({
    archived: false,
  })

  context('When visiting a not complete not archived task details', () => {
    beforeEach(() => {
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
        `/api-proxy/v4/task/${investmentProjectTask.id}/status-complete`,
        {}
      ).as('postTaskStatusCompleteApiRequest')
      clickButton('Mark as complete')
      cy.wait('@postTaskStatusCompleteApiRequest')
      assertUrl(dashboard.myTasks())
    })

    it('should redirect to the investment project and show the Flash message after deleting', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/task/${investmentProjectTask.id}/archive`,
        {}
      ).as('postTaskArchiveApiRequest')
      clickButton('Delete task')
      assertPayload('@postTaskArchiveApiRequest', { reason: 'deleted' })
      assertUrl(dashboard.myTasks())
    })
  })
})

describe('View details for task that is assigned to a company', () => {
  const companyTask = taskWithCompanyFaker({ archived: false })

  context('When visiting a not complete not archived task details', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task/${companyTask.id}`,
        companyTask
      ).as('apiRequest')
      cy.visit(tasks.details(companyTask.id))
      cy.wait('@apiRequest')
    })

    it('should redirect to the investment project and show the Flash message after marking as complete', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/task/${companyTask.id}/status-complete`,
        {}
      ).as('postTaskStatusCompleteApiRequest')
      clickButton('Mark as complete')
      cy.wait('@postTaskStatusCompleteApiRequest')
      assertUrl(dashboard.myTasks())
    })

    it('should redirect to the investment project and show the Flash message after deleting', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v4/task/${companyTask.id}/archive`,
        {}
      ).as('postTaskArchiveApiRequest')
      clickButton('Delete task')
      assertPayload('@postTaskArchiveApiRequest', { reason: 'deleted' })
      assertUrl(dashboard.myTasks())
    })
  })
})

describe('View details for task that is assigned to an interaction', () => {
  const interaction = interactionsListFaker((length = 3))
  const task = taskWithCompanyFaker({
    interaction: { subject: interaction[0].subject, id: interaction[0].id },
  })

  context('When visiting a completed task details', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${task.id}`, task).as(
        'apiRequest'
      )
      cy.visit(tasks.details(task.id))
      cy.wait('@apiRequest')
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
      })
    })
  })
})
