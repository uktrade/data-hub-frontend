import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { investmentProjectTaskFaker } from '../../fakers/task'
import { format } from '../../../../../src/client/utils/date'
import { NOT_SET_TEXT } from '../../../../../src/apps/companies/constants'
import { assertQueryParams } from '../../support/assertions'

const investmentProjectTaskWithAllOptionalFields = investmentProjectTaskFaker({
  archived: true,
})
const investmentProjectTaskMissingAllOptionalFields =
  investmentProjectTaskFaker({
    dueDate: undefined,
    archived: true,
  })

const assertTaskItem = (index, investmentTask) => {
  cy.get('[data-test="collection-item"]')
    .find('a')
    .eq(index)
    .should('contain', `${investmentTask.title}`)
    .and('have.attr', 'href', urls.tasks.details(investmentTask.id))

  cy.get('[data-test="collection-item"]')
    .eq(index)
    .find('[data-test="activity-kind-label"]')
    .should('contain', 'COMPLETED')

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
        investmentTask.dueDate
          ? format(investmentTask.dueDate, 'dd MMMM yyyy')
          : NOT_SET_TEXT
      }`
    )
    .and(
      'contain',
      `Assigned to ${investmentTask.advisers.map((a) => a.name).join(', ')}`
    )
}

describe('Investment project tasks', () => {
  context('When the project has tasks', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/task?investment_project=${fixtures.investment.investmentWithDetails.id}**`,
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
      cy.get('[data-test="sortby"] select').select('created_on')
      assertQueryParams('sortby', 'created_on')
    })

    it('should sort by due date', () => {
      cy.get('[data-test="sortby"] select').select('due_date')
      assertQueryParams('sortby', 'due_date')
    })

    it('should sort by recently created tasks', () => {
      cy.get('[data-test="sortby"] select').select('-created_on')
      assertQueryParams('sortby', '-created_on')
    })
  })
})
