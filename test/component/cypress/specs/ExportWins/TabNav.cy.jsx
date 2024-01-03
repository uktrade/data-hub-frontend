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
          pathname: '/exportwins/unconfirmed',
        }}
        {...props}
      />
    </DataHubProvider>
  )

  context('when rendering the breadcrumbs', () => {
    it('should render both Home and Unconfirmed', () => {
      cy.mount(<Component />)
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Unconfirmed: null,
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
    it('should display both Unconfirmed and Confirmed tabs', () => {
      cy.mount(<Component />)
      cy.get('[data-test="tablist"]').should('exist')
      cy.get('[data-test="tab-item"]').as('tabItems')
      assertLocalNav('@tabItems', ['Unconfirmed', 'Confirmed'])
    })
  })
})
