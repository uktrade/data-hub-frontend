import React from 'react'

import { OrderDetailsSection } from '../../../../../../src/client/modules/Omis/PaymentReceipt'
import { assertGovReactTable } from '../../../../../functional/cypress/support/assertions'

const orderBase = {
  reference: 'RET133/21',
  primaryMarket: {
    name: 'Test primary market',
  },
  subtotalCost: '1234567',
  totalCost: '12345678',
}

const orderNoVat = { ...orderBase, ...{ vatCost: 0 } }
const orderVat = { ...orderBase, ...{ vatCost: 1000 } }

describe('OrderDetailsSection', () => {
  context('When the order has no VAT', () => {
    before(() => {
      cy.viewport(1024, 768)
      cy.mount(<OrderDetailsSection order={orderNoVat} />)
    })

    it('should render the VAT cost as £0', () => {
      assertGovReactTable({
        element: '[data-test="order-details-table"]',
        rows: [
          [
            'Order number',
            'Service description',
            'Market (country)',
            '',
            'Net amount',
          ],
          [
            orderBase.reference,
            'OMIS',
            orderBase.primaryMarket.name,
            '',
            '£12,345.67',
          ],
          ['', '', '', 'VAT', '£0'],
          ['', '', '', 'Total amount', '£123,456.78'],
        ],
      })
    })
  })

  context('When the order has VAT', () => {
    before(() => {
      cy.viewport(1024, 768)
      cy.mount(<OrderDetailsSection order={orderVat} />)
    })

    it('should render the VAT cost', () => {
      assertGovReactTable({
        element: '[data-test="order-details-table"]',
        rows: [
          [
            'Order number',
            'Service description',
            'Market (country)',
            '',
            'Net amount',
          ],
          [
            orderBase.reference,
            'OMIS',
            orderBase.primaryMarket.name,
            '',
            '£12,345.67',
          ],
          ['', '', '', 'VAT at 20%', '£10'],
          ['', '', '', 'Total amount', '£123,456.78'],
        ],
      })
    })
  })
})
