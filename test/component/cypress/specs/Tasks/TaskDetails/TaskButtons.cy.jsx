import React from 'react'

import { taskWithInvestmentProjectFaker } from '../../../../../functional/cypress/fakers/task'
import DataHubProvider from '../../provider'
import { TaskButtons } from '../../../../../../src/client/modules/Tasks/TaskDetails/TaskButtons'
import { assertLink } from '../../../../../functional/cypress/support/assertions'
import urls from '../../../../../../src/lib/urls'

describe('Task buttons', () => {
  const Component = (props) => (
    <DataHubProvider>
      <TaskButtons {...props} />
    </DataHubProvider>
  )

  context('When a task is not completed', () => {
    const task = taskWithInvestmentProjectFaker()

    beforeEach(() => {
      cy.mount(<Component task={task} />)
    })

    it('should show the Mark as complete button', () => {
      cy.get('[data-test="submit-button"]').should(
        'contain.text',
        'Mark as complete'
      )
    })

    it('should show the Edit link with expected url', () => {
      assertLink('edit-form-button', urls.tasks.edit(task.id))
    })

    it('should show the Create similar task button with expected url', () => {
      assertLink(
        'create-similar-task-button',
        urls.tasks.createCopyTask(task.id)
      )
    })

    it('should show the Back link to dashboard when no return url exists', () => {
      assertLink('task-back-link', urls.dashboard.myTasks())
    })
  })

  context('When a task is completed', () => {
    const task = taskWithInvestmentProjectFaker({ archived: true })

    beforeEach(() => {
      cy.mount(<Component task={task} />)
    })

    it('should not show the Mark as complete button', () => {
      cy.get('[data-test="edit-form-button"]').should('not.exist')
    })

    it('should not show the Edit link', () => {
      cy.get('[data-test="submit-button"]').should('not.exist')
    })

    it('should not show the Create similar task link', () => {
      cy.get('[data-test="create-similar-task-button"]').should('not.exist')
    })

    it('should show the Back link to dashboard when no return url exists', () => {
      assertLink('task-back-link', urls.dashboard.myTasks())
    })
  })

  context('When a return url exists', () => {
    const task = taskWithInvestmentProjectFaker()

    beforeEach(() => {
      cy.mount(<Component task={task} returnUrl="a/b/c" />)
    })

    it('should the back button with the returnUrl as the href', () => {
      assertLink('task-back-link', 'a/b/c')
    })
  })
})
