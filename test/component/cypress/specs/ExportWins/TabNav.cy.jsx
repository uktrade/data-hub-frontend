import React from 'react'

import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertLocalNav } from '../../../../end-to-end/cypress/support/assertions'
import ExportWinsTabNav from '../../../../../src/client/modules/ExportWins/Status/ExportWinsTabNav'
import urls from '../../../../../src/lib/urls'

describe('Export wins tab navigation', () => {
  context('when rendering the breadcrumbs', () => {
    it('should render both Home and Rejected', () => {
      cy.mountWithProvider(<ExportWinsTabNav />, {
        initialPath: '/exportwins/rejected',
      })
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export Wins': urls.companies.exportWins.index(),
        Rejected: null,
      })
    })
    it('should render both Home and Pending', () => {
      cy.mountWithProvider(<ExportWinsTabNav />, {
        initialPath: '/exportwins/pending',
      })

      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export Wins': urls.companies.exportWins.index(),
        Pending: null,
      })
    })
    it('should render both Home and Confirmed', () => {
      cy.mountWithProvider(<ExportWinsTabNav />, {
        initialPath: '/exportwins/confirmed',
      })
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export Wins': urls.companies.exportWins.index(),
        Confirmed: null,
      })
    })
  })

  context('when rendering the title', () => {
    it('should render Export wins', () => {
      cy.mountWithProvider(<ExportWinsTabNav />, {
        initialPath: '/exportwins/rejected',
      })
      cy.get('[data-test="heading"]').should('have.text', 'Export wins')
    })
  })

  context('When rendering the TabNav component', () => {
    it('should render three tabs: Pending, Confirmed and Rejected', () => {
      cy.mountWithProvider(<ExportWinsTabNav />)
      cy.get('[role="tablist"]').should('exist')
      cy.get('[role="tab"]').as('tabItems')
      assertLocalNav('@tabItems', ['Pending', 'Confirmed', 'Rejected'])
    })
  })
})
