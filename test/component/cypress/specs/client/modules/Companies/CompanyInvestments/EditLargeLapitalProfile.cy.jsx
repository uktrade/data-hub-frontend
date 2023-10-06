import React from 'react'

import { default as EditLargeCapitalProfile } from '../../../../../../../../src/client/modules/Companies/CompanyInvestments/LargeCapitalProfile/EditLargeCapitalProfile'
import DataHubProvider from '../../../../provider'

describe('Edit large capital profile', () => {
  const Component = (props) => (
    <DataHubProvider>
      <EditLargeCapitalProfile {...props} />
    </DataHubProvider>
  )

  context('When a task has all optional fields set', () => {
    it('the table should show all expected values', () => {
      cy.mount(
        <Component
          profile={{
            results: [
              {
                incompleteDetailsFields: [],
                incompleteRequirementsFields: [],
                incompleteLocationFields: [],
              },
            ],
          }}
        />
      )
      cy.get('#investor_details_toggle-toggle-button-open').click()
      // cy.get('[data-test=investor_details_button]').click()
      // cy.get('[data-test="submit-button"]').click()
    })
  })
})
