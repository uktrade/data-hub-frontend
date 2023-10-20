import React from 'react'

import DataHubProvider, { dispatchResetAction } from '../../provider'
import { Form } from '../../../../../../src/client/components'
import { FieldVATStatus } from '../../../../../../src/client/modules/Omis/EditInvoiceDetails'
import {
  assertErrorSummary,
  assertFieldInput,
  assertFieldRadios,
} from '../../../../../functional/cypress/support/assertions'
import urls from '../../../../../../src/lib/urls'

describe('FieldVATStatus', () => {
  const Component = (props) => (
    <DataHubProvider>
      <Form id="test-form">
        <FieldVATStatus {...props} />
      </Form>
    </DataHubProvider>
  )

  context('When viewing the field with no initial values', () => {
    beforeEach(() => {
      dispatchResetAction()
      cy.mount(<Component order={{ vatVerified: null, vatStatus: null }} />)
    })

    it('should render the main radio buttons', () => {
      cy.get('[data-test="field-vat_status"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'VAT category',
          hint: 'Choose a VAT category based on the billing address country',
          optionsCount: 3,
        })
      })
    })

    it('should render the EU fields', () => {
      cy.get('[data-test="vat-status-eu-company"]').click()
      cy.get('[data-test="field-vat_number"]').then((element) => {
        assertFieldInput({
          element,
          label: 'VAT number',
          hint: 'Validate the EU VAT number (opens in new tab)',
        })
      })
      cy.get('[data-test="eu-vat-link"]').should(
        'have.attr',
        'href',
        urls.external.euVIES
      )
      cy.get('[data-test="field-vat_verified"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Has a valid VAT number been supplied?',
          hint: 'Has a valid VAT number been supplied?',
          optionsCount: 2,
        })
      })
    })
  })

  context('When submitting values in the EU child fields', () => {
    beforeEach(() => {
      dispatchResetAction()
      cy.mount(<Component order={{ vatVerified: null, vatStatus: 'eu' }} />)
    })

    it('should not submit the form with the verification field empty', () => {
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary(['Has a valid VAT number been supplied?'])
    })

    it('should not submit the form with an invalid VAT number', () => {
      cy.get('[data-test="vat-number-input"]').type('invalid')
      cy.get('[data-test="vat-verified-yes"]').click()
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary([
        'VAT number must be a valid EU VAT number starting with the country code, for example IT12345678901 for Italy where "IT" is the country code',
      ])
    })
  })
})
