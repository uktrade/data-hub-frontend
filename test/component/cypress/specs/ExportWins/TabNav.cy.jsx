import React from 'react'
import { Route, Routes } from 'react-router-dom-v5-compat'

import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertLocalNav } from '../../../../end-to-end/cypress/support/assertions'
import ExportWinsTabNav from '../../../../../src/client/modules/ExportWins/Status/ExportWinsTabNav'
import urls from '../../../../../src/lib/urls'
import { MemoryProvider } from '../provider'

describe('Export wins tab navigation', () => {
  const Component = (props) => {
    return (
      <MemoryProvider initialEntries={props.initialEntries}>
        <Routes>
          <Route path={props.path} element={<ExportWinsTabNav />} />
        </Routes>
      </MemoryProvider>
    )
  }

  context('when rendering the breadcrumbs', () => {
    it('should render both Home and Rejected', () => {
      cy.mount(
        <Component
          path="/exportwins/rejected"
          initialEntries={['/exportwins/rejected']}
        />
      )
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
      cy.mount(
        <Component
          path="/exportwins/rejected"
          initialEntries={['/exportwins/rejected']}
        />
      )
      cy.get('[data-test="heading"]').should('have.text', 'Export wins')
    })
  })

  context('When rendering the TabNav component', () => {
    it('should render three tabs: Pending, Confirmed and Rejected', () => {
      cy.mount(<Component />)
      cy.get('[data-test="tablist"]').should('exist')
      cy.get('[data-test="tab-item"]').as('tabItems')
      assertLocalNav('@tabItems', ['Pending', 'Confirmed', 'Rejected'])
    })
  })
})
