import React from 'react'

import { taskWithInvestmentProjectFaker } from '../../../../../../../functional/cypress/fakers/task'
import DataHubProvider from '../../../../provider'
import TaskButtons from '../../../../../../../../src/client/modules/Tasks/TaskDetails/TaskButtons'

describe('Task buttons', () => {
  const Component = (props) => (
    <DataHubProvider>
      <TaskButtons {...props} />
    </DataHubProvider>
  )

  context('When a task is not completed', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker()
    const company =
      investmentProjectTask.investmentProjectTask.investmentProject
        .investorCompany

    it('should show the Mark as complete button', () => {
      cy.mount(<Component task={investmentProjectTask} company={company} />)
      cy.get('[data-test="submit-button"]').should(
        'contain.text',
        'Mark as complete'
      )
    })
  })

  context('When a task is completed', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker({
      archived: true,
    })
    const company =
      investmentProjectTask.investmentProjectTask.investmentProject
        .investorCompany

    it('should not show the Mark as complete button', () => {
      cy.mount(<Component task={investmentProjectTask} company={company} />)
      cy.get('[data-test="submit-button"]').should('not.exist')
    })
  })
})
