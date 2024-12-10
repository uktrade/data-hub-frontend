import React from 'react'

import {
  assertGovReactTable,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'

import { taskWithInvestmentProjectListFaker } from '../../../../../functional/cypress/fakers/task'
import { formatDate } from '../../../../../../src/client/utils/date-utils'
import { MyTasksContent } from '../../../../../../src/client/components/Dashboard/my-tasks/MyTasks'
import urls from '../../../../../../src/lib/urls'

import { keysToSnakeCase } from '../../../../../functional/cypress/fakers/utils'
import { STATUS } from '../../../../../../src/client/modules/Tasks/TaskForm/constants'

describe('My Tasks on the Dashboard', () => {
  // Create 4 tasks of which one is Archived and one has no due date
  const myTasksList = taskWithInvestmentProjectListFaker((length = 4))
  myTasksList[1].status = STATUS.COMPLETED
  myTasksList[3].dueDate = null

  const myTaskResults = myTasksList.map((task) => keysToSnakeCase(task))
  const myTasks = {
    count: 4,
    results: myTaskResults,
  }

  context('When the logged in adviser has four tasks', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(<MyTasksContent myTasks={myTasks} />)
    })

    it('should display the heading 4 tasks', () => {
      cy.get('h2').should('contain', '4 tasks')
    })

    it('should render four table rows in due date in default ascending order', () => {
      assertGovReactTable({
        element: '[data-test="my-tasks-table"]',
        rows: [
          [
            formatDate(myTaskResults[0].due_date, DATE_FORMAT_MEDIUM),
            myTaskResults[0].title,
            myTaskResults[0].company.name,
            myTaskResults[0].investment_project.name,
            myTaskResults[0].advisers[0].name +
              myTaskResults[0].advisers[1].name +
              myTaskResults[0].advisers[2].name,
            'Active',
          ],
          [
            formatDate(myTaskResults[1].due_date, DATE_FORMAT_MEDIUM),
            myTaskResults[1].title,
            myTaskResults[1].company.name,
            myTaskResults[1].investment_project.name,
            myTaskResults[1].advisers[0].name +
              myTaskResults[1].advisers[1].name +
              myTaskResults[1].advisers[2].name,
            'Completed',
          ],
          [
            formatDate(myTaskResults[2].due_date, DATE_FORMAT_MEDIUM),
            myTaskResults[2].title,
            myTaskResults[2].company.name,
            myTaskResults[2].investment_project.name,
            myTaskResults[2].advisers[0].name +
              myTaskResults[2].advisers[1].name +
              myTaskResults[2].advisers[2].name,
            'Active',
          ],
          [
            '',
            myTaskResults[3].title,
            myTaskResults[3].company.name,
            myTaskResults[3].investment_project.name,
            myTaskResults[3].advisers[0].name +
              myTaskResults[3].advisers[1].name +
              myTaskResults[3].advisers[2].name,
            'Active',
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
  const myTasks = {
    count: 0,
    results: [],
  }

  context('When the logged in adviser has no tasks', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(<MyTasksContent myTasks={myTasks} />)
    })
    it('should display the heading 0 tasks', () => {
      cy.get('h2').should('contain', '0 tasks')
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
  const myTasksList = taskWithInvestmentProjectListFaker((length = 1))
  const myTaskResults = myTasksList.map((task) => keysToSnakeCase(task))
  const myTasks = {
    count: 1,
    results: myTaskResults,
  }

  context('When the logged in adviser has three tasks', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(<MyTasksContent myTasks={myTasks} />)
    })

    it('should display the heading 1 task (singular) and not 1 tasks (plural)', () => {
      cy.get('h2').should('contain', '1 task').should('not.contain', '1 tasks')
    })

    it('should contain a button to add task', () => {
      cy.get('[data-test="add-task"]')
        .should('have.text', 'Add task')
        .should('have.attr', 'href', urls.tasks.create())
    })
  })
})
