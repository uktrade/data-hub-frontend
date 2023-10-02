import React from 'react'

import DataHubProvider from '../../provider'
import { ProjectLayout } from '../../../../../../src/client/components/Layout/ProjectLayout'
import { adviserTasksFeatureFlag } from '../../../../../../src/client/modules/AdviserTasks/constants'

describe('ProjectLayout', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ProjectLayout
        {...props}
        userPermissions={[]}
        project={{ investorCompany: {}, stage: {} }}
        breadcrumbs={[]}
      />
    </DataHubProvider>
  )

  context('When a user has the tasks feature flag', () => {
    it('they should see the tasks menu item', () => {
      cy.mount(<Component activeFeatures={[adviserTasksFeatureFlag]} />)
      cy.get('[data-test=project-tasks-link]').should('exist')
    })
  })

  context('When a user is missing the tasks feature flag', () => {
    it('they should not see the tasks menu item', () => {
      cy.mount(<Component activeFeatures={[]} />)
      cy.get('[data-test=project-tasks-link]').should('not.exist')
    })
  })
})
