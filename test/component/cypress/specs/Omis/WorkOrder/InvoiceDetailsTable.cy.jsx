import React from 'react'

import InvoiceDetailsTable from '../../../../../../src/client/modules/Omis/WorkOrderTables/InvoiceDetailsTable'
import {
  assertLink,
  assertSummaryTable,
} from '../../../../../functional/cypress/support/assertions'
import {
  STATUS,
  VAT_STATUS,
} from '../../../../../../src/client/modules/Omis/constants'
import urls from '../../../../../../src/lib/urls'
import { COMPANY_ADDRESS, COMPANY_REGISTERED_ADDRESS } from '../constants'

const order = {
  id: '123',
  status: STATUS.DRAFT,
}

const billingAddress = {
  billingAddress1: 'OMIS line 1',
  billingAddress2: '',
  billingAddressTown: 'OMIS town',
  billingAddressCounty: 'OMIS county',
  billingAddressPostcode: 'OMIS postcode',
  billingAddressCountry: {
    name: 'OMIS Country',
  },
}

const outsideEUFields = {
  totalCost: 10000,
  vatStatus: VAT_STATUS.OUTSIDE_EU,
}

const insideUKFields = {
  totalCost: 1158000,
  subtotalCost: 965000,
  vatCost: 193000,
  vatStatus: VAT_STATUS.UK_COMPANY,
}

const insideEUFields = {
  vatStatus: VAT_STATUS.EU_COMPANY,
  vatNumber: 'IT12345678901',
  poNumber: 'PO number',
}

const verified = {
  totalCost: 965000,
  subtotalCost: 965000,
  vatVerified: true,
}

const notVerified = {
  totalCost: 1158000,
  subtotalCost: 965000,
  vatCost: 193000,
  vatVerified: false,
}

const inactiveOrder = {
  status: STATUS.COMPLETE,
}

const orderWithAddress = { ...order, ...billingAddress }
const orderOutsideEU = { ...order, ...outsideEUFields }
const orderInsideUK = { ...order, ...insideUKFields }
const orderInsideEU = { ...order, ...insideEUFields, ...verified }
const unverifiedOrderInsideEU = { ...order, ...insideEUFields, ...notVerified }

describe('InternalUseTable', () => {
  context(
    'When viewing an order with no invoice details and that uses the company address',
    () => {
      beforeEach(() => {
        cy.mount(
          <InvoiceDetailsTable order={order} company={COMPANY_ADDRESS} />
        )
      })

      it('should display the Not Set messages', () => {
        assertSummaryTable({
          dataTest: 'invoice-details-table',
          heading: 'Invoice details',
          showEditLink: true,
          content: {
            Price:
              'Estimated hours and VAT category must be set to calculate price',
            'Billing address':
              "Address line 1, Address line 2, town, Test County, postcode, Test CountryThe company's address is currently being used for the invoice.",
            'VAT category': 'Not set',
            'Purchase Order (PO) number': 'Not added',
          },
        })

        cy.get('[data-test="company-address-inset"]').should('exist')
      })

      it('should display the edit link', () => {
        assertLink(
          'edit-invoice-details-link',
          urls.omis.edit.invoiceDetails(order.id)
        )
      })
    }
  )

  context(
    'When viewing an order with no invoice details and that uses the company registered address',
    () => {
      beforeEach(() => {
        cy.mount(
          <InvoiceDetailsTable
            order={order}
            company={COMPANY_REGISTERED_ADDRESS}
          />
        )
      })

      it('should display the company registered adddress', () => {
        assertSummaryTable({
          dataTest: 'invoice-details-table',
          heading: 'Invoice details',
          showEditLink: true,
          content: {
            Price:
              'Estimated hours and VAT category must be set to calculate price',
            'Billing address':
              "Registered Address line 1, Registered Address line 2, Registered town, Test Registered County, Registered postcode, Test Registered CountryThe company's address is currently being used for the invoice.",
            'VAT category': 'Not set',
            'Purchase Order (PO) number': 'Not added',
          },
        })

        cy.get('[data-test="company-address-inset"]').should('exist')
      })

      it('should display the edit link', () => {
        assertLink(
          'edit-invoice-details-link',
          urls.omis.edit.invoiceDetails(order.id)
        )
      })
    }
  )

  context('When viewing an order with a specified billing address', () => {
    beforeEach(() => {
      cy.mount(
        <InvoiceDetailsTable
          order={orderWithAddress}
          company={COMPANY_REGISTERED_ADDRESS}
        />
      )
    })

    it('should display the order address over the company one', () => {
      assertSummaryTable({
        dataTest: 'invoice-details-table',
        heading: 'Invoice details',
        showEditLink: true,
        content: {
          Price:
            'Estimated hours and VAT category must be set to calculate price',
          'Billing address':
            'OMIS line 1, OMIS town, OMIS county, OMIS postcode, OMIS Country',
          'VAT category': 'Not set',
          'Purchase Order (PO) number': 'Not added',
        },
      })

      cy.get('[data-test="company-address-inset"]').should('not.exist')
    })

    it('should display the edit link', () => {
      assertLink(
        'edit-invoice-details-link',
        urls.omis.edit.invoiceDetails(order.id)
      )
    })
  })

  context('When viewing an order with the Outside EU VAT category', () => {
    beforeEach(() => {
      cy.mount(
        <InvoiceDetailsTable order={orderOutsideEU} company={COMPANY_ADDRESS} />
      )
    })

    it('should display the correct VAT category and price', () => {
      assertSummaryTable({
        dataTest: 'invoice-details-table',
        heading: 'Invoice details',
        showEditLink: true,
        content: {
          Price: '£100 (No VAT applies)',
          'Billing address':
            "Address line 1, Address line 2, town, Test County, postcode, Test CountryThe company's address is currently being used for the invoice.",
          'VAT category': 'Outside EU',
          'Purchase Order (PO) number': 'Not added',
        },
      })
    })
  })

  context('When viewing an order with the Inside UK VAT category', () => {
    beforeEach(() => {
      cy.mount(
        <InvoiceDetailsTable order={orderInsideUK} company={COMPANY_ADDRESS} />
      )
    })

    it('should display the correct VAT category and price', () => {
      assertSummaryTable({
        dataTest: 'invoice-details-table',
        heading: 'Invoice details',
        showEditLink: true,
        content: {
          Price: '£11,580 (£9,650 excluding VAT)',
          'Billing address':
            "Address line 1, Address line 2, town, Test County, postcode, Test CountryThe company's address is currently being used for the invoice.",
          'VAT category': 'Inside UK',
          'Purchase Order (PO) number': 'Not added',
        },
      })
    })
  })

  context(
    'When viewing an order with the Inside EU VAT category and an unverified VAT number',
    () => {
      beforeEach(() => {
        cy.mount(
          <InvoiceDetailsTable
            order={unverifiedOrderInsideEU}
            company={COMPANY_ADDRESS}
          />
        )
      })

      it('should display the correct VAT category and price', () => {
        assertSummaryTable({
          dataTest: 'invoice-details-table',
          heading: 'Invoice details',
          showEditLink: true,
          content: {
            Price: '£11,580 (£9,650 excluding VAT)',
            'Billing address':
              "Address line 1, Address line 2, town, Test County, postcode, Test CountryThe company's address is currently being used for the invoice.",
            'VAT category': 'Inside EU',
            'VAT number': 'IT12345678901 (Invalid)',
            'Purchase Order (PO) number': orderInsideEU.poNumber,
          },
        })
      })
    }
  )

  context(
    'When viewing an order with the Inside EU VAT category and a verified VAT number',
    () => {
      beforeEach(() => {
        cy.mount(
          <InvoiceDetailsTable
            order={orderInsideEU}
            company={COMPANY_ADDRESS}
          />
        )
      })

      it('should display the correct VAT category and price', () => {
        assertSummaryTable({
          dataTest: 'invoice-details-table',
          heading: 'Invoice details',
          showEditLink: true,
          content: {
            Price: '£9,650 (No VAT applies)',
            'Billing address':
              "Address line 1, Address line 2, town, Test County, postcode, Test CountryThe company's address is currently being used for the invoice.",
            'VAT category': 'Inside EU',
            'VAT number': 'IT12345678901 (Valid)',
            'Purchase Order (PO) number': orderInsideEU.poNumber,
          },
        })
      })
    }
  )

  context('When viewing an inactive order', () => {
    beforeEach(() => {
      cy.mount(
        <InvoiceDetailsTable order={inactiveOrder} company={COMPANY_ADDRESS} />
      )
    })

    it('should display the Not Set messages', () => {
      assertSummaryTable({
        dataTest: 'invoice-details-table',
        heading: 'Invoice details',
        showEditLink: false,
        content: {
          Price:
            'Estimated hours and VAT category must be set to calculate price',
          'Billing address':
            "Address line 1, Address line 2, town, Test County, postcode, Test CountryThe company's address is currently being used for the invoice.",
          'VAT category': 'Not set',
          'Purchase Order (PO) number': 'Not added',
        },
      })

      cy.get('[data-test="company-address-inset"]').should('exist')
    })
  })
})
