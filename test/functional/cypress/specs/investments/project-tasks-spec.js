import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { taskWithInvestmentProjectFaker } from '../../fakers/task'
import {
  formatDate,
  DATE_FORMAT_DAY_MONTH_YEAR,
} from '../../../../../src/client/utils/date-utils'
import { NOT_SET_TEXT } from '../../../../../src/apps/companies/constants'
import { assertQueryParams } from '../../support/assertions'

const investmentProjectTaskWithAllOptionalFields =
  taskWithInvestmentProjectFaker(
    {},
    {
      id: fixtures.investment.investmentWithDetails.id,
    }
  )
const investmentProjectTaskMissingAllOptionalFields =
  taskWithInvestmentProjectFaker(
    {
      dueDate: undefined,
      archived: true,
    },
    {
      id: fixtures.investment.investmentWithDetails.id,
    }
  )

const assertTaskItem = (index, investmentTask) => {
  cy.get('[data-test="collection-item"]')
    .find('a')
    .eq(index)
    .should('contain', `${investmentTask.title}`)
    .and(
      'have.attr',
      'href',
      `${urls.tasks.details(investmentTask.id)}?returnUrl=${encodeURIComponent(
        urls.investments.projects.tasks.index(
          investmentTask.investmentProject.id
        )
      )}`
    )
  if (investmentTask.archived) {
    cy.get('[data-test="collection-item"]')
      .eq(index)
      .find('[data-test="activity-kind-label"]')
      .should('contain', 'COMPLETED')
  }

  cy.get('[data-test="collection-item"]')
    .eq(index)
    .find('[data-test="metadata-label"]')
    .then((items) => {
      expect(items[0]).to.have.text('Date created')
      expect(items[1]).to.have.text('Due date')
      expect(items[2]).to.have.text('Assigned to')
    })

  cy.get('[data-test="collection-item"]')
    .eq(index)
    .find('[data-test="metadata-value"]')
    .then((items) => {
      expect(items[0]).to.have.text(
        `${formatDate(investmentTask.createdOn, DATE_FORMAT_DAY_MONTH_YEAR)}`
      )
      expect(items[1]).to.have.text(
        `${
          investmentTask.dueDate
            ? formatDate(investmentTask.dueDate, DATE_FORMAT_DAY_MONTH_YEAR)
            : NOT_SET_TEXT
        }`
      )
      expect(items[2]).to.have.text(
        `${investmentTask.advisers.map((a) => a.name).join(', ')}`
      )
    })
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
          urls.tasks.createInvestmentProject(
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
