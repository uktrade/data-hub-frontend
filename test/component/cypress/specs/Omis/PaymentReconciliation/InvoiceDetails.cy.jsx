import React from 'react'

import { InvoiceDetails } from '../../../../../../src/client/modules/Omis/PaymentReconciliation'
import { assertGovReactTable } from '../../../../../functional/cypress/support/assertions'

const invoice = {
  paymentDueDate: '2017-09-27T08:59:20.381047',
  subtotalCost: 12345,
  totalCost: 123456,
}

describe('PaymentReconciliation invoice details', () => {
  context('When viewing a company with a non-registered address', () => {
    beforeEach(() => {
      cy.mount(<InvoiceDetails invoice={invoice} reference={'test ref'} />)
    })

    it('should render the heading', () => {
      cy.get('[data-test=invoice-heading]')
        .should('exist')
        .should('have.text', 'Invoice details')
    })

    it('should render the invoice details', () => {
      assertGovReactTable({
        element: '[data-test="invoice-table"]',
        rows: [
          ['Order reference', 'test ref'],
          ['Amount (excluding VAT)', '£123.45'],
          ['Amount (including VAT)', '£1,234.56'],
          ['Payment due date', '27 September 2017 (6 years ago)'],
        ],
      })
    })
  })
})
