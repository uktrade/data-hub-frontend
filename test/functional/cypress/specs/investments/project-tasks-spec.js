import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { investmentProjectTaskFaker, taskFaker } from '../../fakers/task'
import { format } from '../../../../../src/client/utils/date'
import { NOT_SET_TEXT } from '../../../../../src/apps/companies/constants'
import { assertQueryParams } from '../../support/assertions'

const investmentProjectTaskWithAllOptionalFields = investmentProjectTaskFaker()
const investmentProjectTaskMissingAllOptionalFields =
  investmentProjectTaskFaker({ task: taskFaker({ dueDate: undefined }) })

const assertTaskItem = (index, investmentTask) => {
  cy.get('[data-test="collection-item"]')
    .eq(index)
    .find('a')
    .should('have.text', `${investmentTask.task.title}`)
    .and('have.attr', 'href', urls.tasks.details(investmentTask.task.id))

  cy.get('[data-test="collection-item"]')
    .eq(index)
    .find('[data-test="metadata"]')
    .should(
      'contain',
      `Date created ${format(investmentTask.createdOn, 'dd MMMM yyyy')}`
    )
    .and(
      'contain',
      `Due date ${
        investmentTask.task.dueDate
          ? format(investmentTask.task.dueDate, 'dd MMMM yyyy')
          : NOT_SET_TEXT
      }`
    )
    .and(
      'contain',
      `Assigned to ${investmentTask.task.advisers
        .map((a) => a.name)
        .join(', ')}`
    )
}

describe('Investment project tasks', () => {
  context('When the project has tasks', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/investmentprojecttask?investment_project=${fixtures.investment.investmentWithDetails.id}**`,
        {
          body: {
            count: 2,
            results: [
              investmentProjectTaskWithAllOptionalFields,
              investmentProjectTaskMissingAllOptionalFields,
            ],
          },
        }
      ).as('apiRequest')
      cy.visit(
        urls.investments.projects.tasks.index(
          fixtures.investment.investmentWithDetails.id
        )
      )
      cy.wait('@apiRequest')
    })

    it('should display the task with all fields', () => {
      assertTaskItem(0, investmentProjectTaskWithAllOptionalFields)
    })

    it('should display the task with missing optional fields', () => {
      assertTaskItem(1, investmentProjectTaskMissingAllOptionalFields)
    })

    it('should display the add task button', () => {
      cy.get('[data-test="add-collection-item-button"]')
        .should('exist')
        .should('contain', 'Add task')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.tasks.create(
            fixtures.investment.investmentWithDetails.id
          )
        )
    })

    it('should sort by oldest tasks', () => {
      cy.get('[data-test="sortby"] select').select('task__created_on')
      assertQueryParams('sortby', 'task__created_on')
    })

    it('should sort by due date', () => {
      cy.get('[data-test="sortby"] select').select('task__due_date')
      assertQueryParams('sortby', 'task__due_date')
    })

    it('should sort by recently created tasks', () => {
      cy.get('[data-test="sortby"] select').select('-task__created_on')
      assertQueryParams('sortby', '-task__created_on')
    })
  })
})
