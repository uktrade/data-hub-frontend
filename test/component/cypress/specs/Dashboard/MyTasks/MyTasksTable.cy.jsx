import React from 'react'

import {
  assertGovReactTable,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'

import { taskWithInvestmentProjectListFaker } from '../../../../../functional/cypress/fakers/task'
import { formatMediumDate } from '../../../../../../src/client/utils/date'
import { MyTasksContent } from '../../../../../../src/client/components/Dashboard/my-tasks/MyTasks'
import urls from '../../../../../../src/lib/urls'

import { keysToSnakeCase } from '../../../../../functional/cypress/fakers/utils'

describe('My Tasks on the Dashboard', () => {
  const Component = (props) => <MyTasksContent {...props} />
  const myTasksList = taskWithInvestmentProjectListFaker()
  const myTaskResults = myTasksList.map((task) => keysToSnakeCase(task))
  const myTasks = {
    count: 3,
    results: myTaskResults,
  }

  context('When the logged in adviser has three tasks', () => {
    beforeEach(() => {
      cy.mount(<Component myTasks={myTasks} />)
    })

    it('should display the heading 3 tasks', () => {
      cy.get('h3').should('contain', '3 tasks')
    })

    it('should render three table rows in due date ascending order as this is the default', () => {
      assertGovReactTable({
        element: '[data-test="my-tasks-table"]',
        rows: [
          [
            formatMediumDate(myTaskResults[0].due_date),
            myTaskResults[0].title,
            myTaskResults[0].investment_project.name,
            myTaskResults[0].advisers[0].name +
              myTaskResults[0].advisers[1].name +
              myTaskResults[0].advisers[2].name,
          ],
          [
            formatMediumDate(myTaskResults[1].due_date),
            myTaskResults[1].title,
            myTaskResults[1].investment_project.name,
            myTaskResults[1].advisers[0].name +
              myTaskResults[1].advisers[1].name +
              myTaskResults[1].advisers[2].name,
          ],
          [
            formatMediumDate(myTaskResults[2].due_date),
            myTaskResults[2].title,
            myTaskResults[2].investment_project.name,
            myTaskResults[2].advisers[0].name +
              myTaskResults[2].advisers[1].name +
              myTaskResults[2].advisers[2].name,
          ],
        ],
      })
    })

    it('The task title should link to the Task details page', () => {
      assertLink(
        `${myTaskResults[0].id}-task-link`,
        urls.tasks.details(myTaskResults[0].id)
      )
      assertLink(
        `${myTaskResults[1].id}-task-link`,
        urls.tasks.details(myTaskResults[1].id)
      )
      assertLink(
        `${myTaskResults[2].id}-task-link`,
        urls.tasks.details(myTaskResults[2].id)
      )
    })
  })
})

describe('My Tasks on the Dashboard', () => {
  const Component = (props) => <MyTasksContent {...props} />
  const myTasks = {
    count: 0,
    results: [],
  }

  context('When the logged in adviser has no tasks', () => {
    beforeEach(() => {
      cy.mount(<Component myTasks={myTasks} />)
    })
    it('should display the heading 0 tasks', () => {
      cy.get('h3').should('contain', '0 tasks')
    })
    it('should not render the table', () => {
      cy.get('[data-test="my-tasks-table"]').should('not.exist')
    })
    it('should contain text notifying there are no tasks', () => {
      cy.get('span').should(
        'contain',
        'You do not have any tasks at this time.'
      )
    })
  })
})

describe('My Tasks on the Dashboard', () => {
  const Component = (props) => <MyTasksContent {...props} />
  const myTasksList = taskWithInvestmentProjectListFaker((length = 1))
  const myTaskResults = myTasksList.map((task) => keysToSnakeCase(task))
  const myTasks = {
    count: 1,
    results: myTaskResults,
  }

  context('When the logged in adviser has three tasks', () => {
    beforeEach(() => {
      cy.mount(<Component myTasks={myTasks} />)
    })

    it('should display the heading 1 task (singular) and not 1 tasks (plural)', () => {
      cy.get('h3').should('contain', '1 task').should('not.contain', '1 tasks')
    })
  })
})
