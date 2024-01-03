import React from 'react'

import AccessDenied from '../../../../../src/client/components/AccessDenied'
import urls from '../../../../../src/lib/urls'
import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import DataHubProvider from '../provider'

describe('AccessDenied', () => {
  const Component = (props) => (
    <DataHubProvider>
      <AccessDenied {...props} />
    </DataHubProvider>
  )

  context('When breadcrumbs are provided', () => {
    it('they are used instead of the default', () => {
      cy.mount(
        <Component
          breadcrumbs={[
            {
              link: urls.dashboard.index(),
              text: 'Home',
            },
            {
              link: urls.companies.index(),
              text: 'Companies',
            },
          ]}
        />
      )
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
      })
    })
  })
})
