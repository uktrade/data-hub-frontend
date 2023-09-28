import React from 'react'

import RoutedRelatedCompaniesCheckboxGroup from '../../../../src/client/components/RoutedRelatedCompaniesCheckboxGroup/Filter'
import DataHubProvider from './provider'

describe('RoutedRelatedCompaniesCheckboxGroup', () => {
  const Component = ({ company, taskResponse = {} }) => (
    <DataHubProvider
      resetTasks={true}
      tasks={{
        ['RelatedCompaniesCount']: () => {
          return taskResponse
        },
      }}
    >
      <RoutedRelatedCompaniesCheckboxGroup company={company} />
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

  context('When company has a duns number and no related companies', () => {
    it('should not render the filter', () => {
      cy.mount(
        <Component
          company={{ dunsNumber: 1234 }}
          taskResponse={{ relatedCompaniesCount: 0 }}
        />
      )
      cy.get('[data-test="include-related-companies-filter"]').should(
        'not.exist'
      )
    })
  })

  context(
    'When company has a duns number and at least 1 related company',
    () => {
      it('should render the filter', () => {
        cy.mount(
          <Component
            company={{ dunsNumber: 1234 }}
            taskResponse={{ relatedCompaniesCount: 1 }}
          />
        )
        cy.get('[data-test="include-related-companies-filter"]').should('exist')
      })
    }
  )
})
