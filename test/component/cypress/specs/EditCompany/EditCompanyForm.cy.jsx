import React from 'react'
import DataHubProvider from '../provider'
import EditCompanyForm from '../../../../../src/apps/companies/apps/edit-company/client/EditCompanyForm'

describe('EditCompanyForm', () => {
  const base_company = { duns_number: 1, address: {}, number_of_employees: 1 }

  const Component = (props) => (
    <DataHubProvider>
      <EditCompanyForm formInitialValues={{}} {...props} />
    </DataHubProvider>
  )

  context('When turnover_gbp and turnover_range is null', () => {
    it('should render a "Not set" message', () => {
      cy.mount(
        <Component
          company={{
            ...base_company,
            turnover_gbp: null,
            turnover_range: null,
          }}
        />
      )
      cy.get('[data-test="field-turnover"]').contains('Not set')
    })
  })

  context('When turnover_gbp is populated and turnover_range is null', () => {
    it('should render the value as a currency', () => {
      cy.mount(
        <Component
          company={{
            ...base_company,
            turnover_gbp: 50,
            turnover_range: null,
          }}
        />
      )
      cy.get('[data-test="field-turnover"]').contains('£50')
    })
  })

  context('When turnover_gbp is null and turnover_range is null', () => {
    it('should render the turnover range value', () => {
      cy.mount(
        <Component
          company={{
            ...base_company,
            turnover_gbp: null,
            turnover_range: { name: 'abc' },
          }}
        />
      )
      cy.get('[data-test="field-turnover"]').contains('abc')
    })
  })
})
