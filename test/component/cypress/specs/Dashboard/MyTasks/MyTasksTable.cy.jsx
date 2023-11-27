import React from 'react'

import {
  assertGovReactTable,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'

import {
  taskWithInvestmentProjectFaker,
  basicAdviserFaker,
} from '../../../../../functional/cypress/fakers/task'
import { formatMediumDate } from '../../../../../../src/client/utils/date'
import { MyTasksContent } from '../../../../../../src/client/components/Dashboard/my-tasks/MyTasks'
import urls from '../../../../../../src/lib/urls'

describe('My Tasks on the Dashboard', () => {
  const Component = (props) => <MyTasksContent {...props} />
  const adviser1 = basicAdviserFaker()
  const adviser2 = basicAdviserFaker()
  const shortest_due_date = taskWithInvestmentProjectFaker({
    advisers: [adviser1],
    dueDate: '2025-01-01',
    createdBy: adviser1,
  })
  const middle_due_date = taskWithInvestmentProjectFaker({
    advisers: [adviser1],
    dueDate: '2026-01-01',
    createdBy: adviser2,
  })
  const longest_due_date = taskWithInvestmentProjectFaker({
    advisers: [adviser2],
    dueDate: '2027-01-01',
    createdBy: adviser1,
  })
  const myTasks = {
    count: 3,
    results: [
      {
        investment_project: shortest_due_date.investmentProject,
        advisers: [
          {
            name: adviser1.name,
          },
        ],
        due_date: shortest_due_date.dueDate,
        company: {
          name: 'Mars Exports Ltd',
        },
        id: shortest_due_date.id,
        title: shortest_due_date.title,
        created_by: {
          name: adviser1.name,
        },
      },
      {
        investment_project: middle_due_date.investmentProject,
        advisers: [
          {
            name: adviser1.name,
          },
        ],
        due_date: middle_due_date.dueDate,
        company: {
          name: 'Mars Exports Ltd',
        },
        id: middle_due_date.id,
        title: middle_due_date.title,
        created_by: {
          name: adviser1.name,
        },
      },
      {
        investment_project: longest_due_date.investmentProject,
        advisers: [
          {
            name: adviser2.name,
          },
        ],
        due_date: longest_due_date.dueDate,
        company: {
          name: 'Mars Exports Ltd',
        },
        id: longest_due_date.id,
        title: longest_due_date.title,
        created_by: {
          name: adviser1.name,
        },
      },
    ],
  }

  context('When the logged in adviser has three tasks', () => {
    beforeEach(() => {
      cy.mount(<Component myTasks={myTasks} />)
    })

    it('should display the heading 3 tasks', () => {
      cy.get('h3').should('contain', '3 tasks')
    })

    it('should render three table rows in due date asc order', () => {
      assertGovReactTable({
        element: '[data-test="my-tasks-table"]',
        rows: [
          [
            formatMediumDate(shortest_due_date.dueDate),
            shortest_due_date.title,
            shortest_due_date.investmentProject.name,
            shortest_due_date.advisers[0].name,
          ],
          [
            formatMediumDate(middle_due_date.dueDate),
            middle_due_date.title,
            middle_due_date.investmentProject.name,
            middle_due_date.advisers[0].name,
          ],
          [
            formatMediumDate(longest_due_date.dueDate),
            longest_due_date.title,
            longest_due_date.investmentProject.name,
            longest_due_date.advisers[0].name,
          ],
        ],
      })
    })

    it('The task title should link to the Task details page', () => {
      assertLink(
        `${shortest_due_date.id}-task-link`,
        urls.tasks.details(shortest_due_date.id)
      )
      assertLink(
        `${middle_due_date.id}-task-link`,
        urls.tasks.details(middle_due_date.id)
      )
      assertLink(
        `${longest_due_date.id}-task-link`,
        urls.tasks.details(longest_due_date.id)
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
  const adviser1 = basicAdviserFaker()
  const shortest_due_date = taskWithInvestmentProjectFaker({
    advisers: [adviser1],
    dueDate: '2024-01-01',
    createdBy: adviser1,
  })
  const myTasks = {
    count: 1,
    results: [
      {
        investment_project: shortest_due_date.investmentProject,
        advisers: [
          {
            name: adviser1.name,
          },
        ],
        due_date: shortest_due_date.dueDate,
        company: {
          name: 'Mars Exports Ltd',
        },
        id: shortest_due_date.id,
        title: shortest_due_date.title,
        created_by: {
          name: adviser1.name,
        },
      },
    ],
  }

  context('When the logged in adviser has three tasks', () => {
    beforeEach(() => {
      cy.mount(<Component myTasks={myTasks} />)
    })

    it('should display the heading 1 task', () => {
      cy.get('h3').should('contain', '1 task').should('not.contain', '1 tasks')
    })

    it('should render one table row', () => {
      assertGovReactTable({
        element: '[data-test="my-tasks-table"]',
        rows: [
          [
            formatMediumDate(shortest_due_date.dueDate),
            shortest_due_date.title,
            shortest_due_date.investmentProject.name,
            shortest_due_date.advisers[0].name,
          ],
        ],
      })
    })

    it('The task title should link to the Task details page', () => {
      assertLink(
        `${shortest_due_date.id}-task-link`,
        urls.tasks.details(shortest_due_date.id)
      )
    })
  })
})
