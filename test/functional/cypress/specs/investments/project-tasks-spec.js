import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { investmentProjectTaskFaker, taskFaker } from '../../fakers/task'
import { format } from '../../../../../src/client/utils/date'
import { NOT_SET_TEXT } from '../../../../../src/apps/companies/constants'

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
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/investmentprojecttask?investment_project=${fixtures.investment.investmentWithDetails.id}&limit=10&offset=0&sortby=task__due_date&archived=false`,
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
  })
})