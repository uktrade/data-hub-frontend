import React from 'react'

import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertLocalNav } from '../../../../end-to-end/cypress/support/assertions'
import ExportWins from '../../../../../src/client/modules/ExportWins'
import urls from '../../../../../src/lib/urls'
import DataHubProvider from '../provider'

describe('Export wins tab navigation', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ExportWins
        location={{
          pathname: '/exportwins/sent',
        }}
        {...props}
      />
    </DataHubProvider>
  )

  context('when rendering the breadcrumbs', () => {
    it('should render both Home and Sent', () => {
      cy.mount(<Component />)
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Sent: null,
      })
    })
    it('should render both Home and Won', () => {
      cy.mount(
        <Component
          location={{
            pathname: '/exportwins/won',
          }}
        />
      )
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Won: null,
      })
    })
  })

  context('when rendering the title', () => {
    it('should render Export wins', () => {
      cy.mount(<Component />)
      cy.get('[data-test="heading"]').should('have.text', 'Export wins')
    })
  })

  context('When rendering the TabNav component', () => {
    it('should display both Sent and Won tabs', () => {
      cy.mount(<Component />)
      cy.get('[data-test="tablist"]').should('exist')
      cy.get('[data-test="tab-item"]').as('tabItems')
      assertLocalNav('@tabItems', ['Sent', 'Won'])
    })
  })
})
