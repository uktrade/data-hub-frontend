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
        'Export Wins': urls.companies.exportWins.index(),
        Rejected: null,
      })
    })
    it('should render both Home and Pending', () => {
      cy.mount(
        <Component
          location={{
            pathname: '/exportwins/pending',
          }}
        />
      )
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export Wins': urls.companies.exportWins.index(),
        Pending: null,
      })
    })
    it('should render both Home and Confirmed', () => {
      cy.mount(
        <Component
          location={{
            pathname: '/exportwins/confirmed',
          }}
        />
      )
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export Wins': urls.companies.exportWins.index(),
        Confirmed: null,
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
    it('should render three tabs: Rejected, Pending and Confirmed', () => {
      cy.mount(<Component />)
      cy.get('[data-test="tablist"]').should('exist')
      cy.get('[data-test="tab-item"]').as('tabItems')
      assertLocalNav('@tabItems', ['Rejected', 'Pending', 'Confirmed'])
    })
  })
})
