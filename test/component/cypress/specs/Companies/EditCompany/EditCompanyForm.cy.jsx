import React from 'react'

import EditCompanyForm from '../../../../../../src/apps/companies/apps/edit-company/client/EditCompanyForm'

describe('EditCompanyForm', () => {
  const base_company = { duns_number: 1, address: {}, number_of_employees: 1 }

  context('When turnover_gbp and turnover_range is null', () => {
    it('should render a "Not set" message', () => {
      cy.mountWithProvider(
        <EditCompanyForm
          formInitialValues={{}}
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
      cy.mountWithProvider(
        <EditCompanyForm
          formInitialValues={{}}
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
      cy.mountWithProvider(
        <EditCompanyForm
          formInitialValues={{}}
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
  context('When employee_range and number_of_employees is null', () => {
    it('should render a "Not set" message', () => {
      cy.mountWithProvider(
        <EditCompanyForm
          formInitialValues={{}}
          company={{
            ...base_company,
            employee_range: null,
            number_of_employees: null,
          }}
        />
      )
      cy.get('[data-test="field-number_of_employees"]').contains('Not set')
    })
  })
  context(
    'When number of employee is populated and employee range is null',
    () => {
      it('should render the value as a 50', () => {
        cy.mountWithProvider(
          <EditCompanyForm
            formInitialValues={{}}
            company={{
              ...base_company,
              number_of_employees: 50,
              employee_range: null,
            }}
          />
        )
        cy.get('[data-test="field-number_of_employees"]').contains('50')
      })
    }
  )
  context('When number of employee is null and employee_range is 10-49', () => {
    it('should render the turnover range value', () => {
      cy.mountWithProvider(
        <EditCompanyForm
          formInitialValues={{}}
          company={{
            ...base_company,
            number_of_employees: null,
            employee_range: { name: '10 to 49' },
          }}
        />
      )
      cy.get('[data-test="field-number_of_employees"]').contains('10 to 49')
    })
  })
})
