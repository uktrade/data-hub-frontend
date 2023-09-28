// does the add tasks link appear with the correct link
// does the task display with the correct values
//  check multiple advisors, check due date not set, check created dates
// check the pagination

import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { investmentProjectTaskListFaker } from '../../fakers/tasks'

const tasksList = investmentProjectTaskListFaker(15)

describe('Investment project tasks', () => {
  context('When the project has tasks', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/investmentprojecttask?investment_project=${fixtures.investment.investmentWithDetails.id}&limit=10&offset=0&sortby=task__due_date`,
        {
          body: {
            count: tasksList.length,
            results: tasksList,
          },
        }
      ).as('apiRequest')
      cy.visit(
        urls.investments.projects.tasks.index(
          fixtures.investment.investmentWithDetails.id
        )
      )
    })

    it('should display the tasks list', () => {
      cy.wait('@apiRequest')
      // cy.get('[data-test="collection-header').should('contain', '1 interaction')
    })
  })
})
