import React from 'react'
import RoutedRelatedCompaniesCheckboxGroup from '../../../../src/client/components/RoutedRelatedCompaniesCheckboxGroup/Filter'
import DataHubProvider from './provider'

describe('RoutedRelatedCompaniesCheckboxGroup', () => {
  const Component = (props) => (
    <DataHubProvider
      tasks={{
        ['RelatedCompaniesCount']: () => {
          return {}
        },
      }}
    >
      <RoutedRelatedCompaniesCheckboxGroup {...props} />
    </DataHubProvider>
  )

  context('When company does not have a duns number', () => {
    it('should not render the filter', () => {
      cy.mount(<Component company={{ dunsNumber: null }} />)
      cy.get('[data-test="include-related-companies-filter"]').should(
        'not.exist'
      )
    })
  })

  context('When company has a duns number', () => {
    it('should render the filter', () => {
      cy.mount(<Component company={{ dunsNumber: 1234 }} />)
      cy.get('[data-test="include-related-companies-filter"]').should('exist')
    })
  })
})
