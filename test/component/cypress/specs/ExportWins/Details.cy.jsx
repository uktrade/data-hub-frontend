import React from 'react'

import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import ExportWinDetails from '../../../../../src/client/modules/ExportWins/Details'
import urls from '../../../../../src/lib/urls'
import DataHubProvider from '../provider'

describe('Export wins tab navigation', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ExportWinDetails
        location={{
          pathname: '/exportwins/1/details',
        }}
        {...props}
      />
    </DataHubProvider>
  )

  context('when rendering the breadcrumbs', () => {
    it('should render...', () => {
      cy.mount(<Component />)
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Export wins': urls.companies.exportWins.index(),
        'Rolls Reece cars to United Arab Emirates': null,
      })
    })
  })

  context('when rendering the title', () => {
    it('should render Export wins', () => {
      cy.mount(<Component />)
      cy.get('[data-test="heading"]').should(
        'have.text',
        'Rolls Reece cars to United Arab Emirates'
      )
    })
  })
})
