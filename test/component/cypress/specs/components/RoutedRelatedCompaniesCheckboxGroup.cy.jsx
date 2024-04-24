import React from 'react'

import RoutedRelatedCompaniesCheckboxGroup from '../../../../../src/client/components/RoutedRelatedCompaniesCheckboxGroup/Filter'

describe('RoutedRelatedCompaniesCheckboxGroup', () => {
  context('When company does not have a duns number', () => {
    it('should not render the filter', () => {
      cy.mountWithProvider(
        <RoutedRelatedCompaniesCheckboxGroup company={{ dunsNumber: null }} />,
        {
          tasks: {
            ['RelatedCompaniesCount']: () => {
              return taskResponse
            },
          },
        }
      )
      cy.get('[data-test="include-related-companies-filter"]').should(
        'not.exist'
      )
    })
  })

  context('When company has a duns number and no related companies', () => {
    it('should not render the filter', () => {
      cy.mountWithProvider(
        <RoutedRelatedCompaniesCheckboxGroup company={{ dunsNumber: 1234 }} />,
        {
          tasks: {
            ['RelatedCompaniesCount']: () => {
              return { relatedCompaniesCount: 0 }
            },
          },
        }
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
        cy.mountWithProvider(
          <RoutedRelatedCompaniesCheckboxGroup
            company={{ dunsNumber: 1234 }}
          />,
          {
            tasks: {
              ['RelatedCompaniesCount']: () => {
                return { relatedCompaniesCount: 1 }
              },
            },
          }
        )
        cy.get('[data-test="include-related-companies-filter"]').should('exist')
      })
    }
  )
})
