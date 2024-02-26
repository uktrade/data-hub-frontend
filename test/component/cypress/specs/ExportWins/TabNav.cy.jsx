import React from 'react'

import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertLocalNav } from '../../../../end-to-end/cypress/support/assertions'
import ExportWinsTabNav from '../../../../../src/client/modules/ExportWins/Status/ExportWinsTabNav'
import urls from '../../../../../src/lib/urls'
import DataHubProvider from '../provider'

describe('Export wins tab navigation', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ExportWinsTabNav
        location={{
          pathname: '/exportwins/rejected',
        }}
        {...props}
      />
    </DataHubProvider>
  )

  context('when rendering the breadcrumbs', () => {
    it('should render both Home and Rejected', () => {
      cy.mount(<Component />)
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Rejected: null,
      })
    })
    it('should render both Home and Sent', () => {
      cy.mount(
        <Component
          location={{
            pathname: '/exportwins/sent',
          }}
        />
      )
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
    it('should render three tabs: Rejected, Sent and Won', () => {
      cy.mount(<Component />)
      cy.get('[data-test="tablist"]').should('exist')
      cy.get('[data-test="tab-item"]').as('tabItems')
      assertLocalNav('@tabItems', ['Rejected', 'Sent', 'Won'])
    })
  })
})
