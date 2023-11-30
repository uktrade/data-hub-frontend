import React from 'react'

import { taskWithInvestmentProjectFaker } from '../../../../../functional/cypress/fakers/task'
import DataHubProvider from '../../provider'
import { TaskButtons } from '../../../../../../src/client/modules/Tasks/TaskDetails/TaskButtons'
import { assertLink } from '../../../../../functional/cypress/support/assertions'

describe('Task buttons', () => {
  const Component = (props) => (
    <DataHubProvider>
      <TaskButtons {...props} />
    </DataHubProvider>
  )

  context('When a task is not completed', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker()

    beforeEach(() => {
      cy.mount(<Component task={investmentProjectTask} editUrl={'/1/2/3'} />)
    })

    it('should show the Mark as complete button', () => {
      cy.get('[data-test="submit-button"]').should(
        'contain.text',
        'Mark as completed'
      )
    })

    it('should show the Edit link with expected url', () => {
      assertLink('edit-form-button', '/1/2/3')
    })
    it('should show the Back link with expected url', () => {
      assertLink(
        'back-button',
        `/investments/projects/${investmentProjectTask.investmentProject.id}/tasks?sortby=-created_on`
      )
    })
  })

  context('When a task is completed', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker({
      archived: true,
    })

    beforeEach(() => {
      cy.mount(<Component task={investmentProjectTask} editUrl={'/1/2/3'} />)
    })

    it('should not show the Mark as complete button', () => {
      cy.get('[data-test="submit-button"]').should('not.exist')
    })

    it('should show the Edit link with expected url', () => {
      assertLink('edit-form-button', '/1/2/3')
    })
    it('should show the Back link with expected url', () => {
      assertLink(
        'back-button',
        `/investments/projects/${investmentProjectTask.investmentProject.id}/tasks?sortby=-created_on`
      )
    })
  })
})
