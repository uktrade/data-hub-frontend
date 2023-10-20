import React from 'react'

import { BillingAddress } from '../../../../../../src/client/modules/Omis/EditInvoiceDetails'
import urls from '../../../../../../src/lib/urls'
import {
  COMPANY_ADDRESS,
  COMPANY_REGISTERED_ADDRESS,
  COMPANY_BOTH_ADDRESSES,
} from '../constants'

const orderNoAddress = {
  id: '12345',
  billingAddressCountry: null,
}

const orderWithAddress = {
  id: '12345',
  billingAddress1: 'OMIS line 1',
  billingAddress2: '',
  billingAddressTown: 'OMIS town',
  billingAddressCounty: 'OMIS county',
  billingAddressPostcode: 'OMIS postcode',
  billingAddressCountry: {
    name: 'OMIS Country',
  },
}

describe('EditInvoiceDetails billing address', () => {
  context('When the company has a non-registered address', () => {
    beforeEach(() => {
      cy.mount(
        <BillingAddress company={COMPANY_ADDRESS} order={orderNoAddress} />
      )
    })

    it('should render the heading', () => {
      cy.get('[data-test=billing-address-heading]')
        .should('exist')
        .should('have.text', 'Billing address')
    })

    it('should render the company address', () => {
      cy.get('[data-test="invoice-address"]')
        .should('exist')
        .should(
          'have.text',
          'Address line 1Address line 2townTest CountypostcodeTest Country'
        )
    })

    it('should render the inset text', () => {
      cy.get('[data-test="company-address-inset"]')
        .should('exist')
        .should(
          'have.text',
          "The company's address is currently being used for the invoice.Add a different billing address"
        )
    })

    it('should render the link for the billing address form', () => {
      cy.get('[data-test="billing-address-link"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          `${urls.omis.edit.billingAddress(
            orderNoAddress.id
          )}?returnUrl=${urls.omis.edit.invoiceDetails(orderNoAddress.id)}`
        )
    })
  })

  context('When the company has a registered address', () => {
    beforeEach(() => {
      cy.mount(
        <BillingAddress
          company={COMPANY_REGISTERED_ADDRESS}
          order={orderNoAddress}
        />
      )
    })

    it('should render the heading', () => {
      cy.get('[data-test=billing-address-heading]')
        .should('exist')
        .should('have.text', 'Billing address')
    })

    it('should render the registered address', () => {
      cy.get('[data-test="invoice-address"]')
        .should('exist')
        .should(
          'have.text',
          'Registered Address line 1Registered Address line 2Registered townTest Registered CountyRegistered postcodeTest Registered Country'
        )
    })

    it('should render the inset text', () => {
      cy.get('[data-test="company-address-inset"]')
        .should('exist')
        .should(
          'have.text',
          "The company's address is currently being used for the invoice.Add a different billing address"
        )
    })

    it('should render the link for the billing address form', () => {
      cy.get('[data-test="billing-address-link"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          `${urls.omis.edit.billingAddress(
            orderNoAddress.id
          )}?returnUrl=${urls.omis.edit.invoiceDetails(orderNoAddress.id)}`
        )
    })
  })

  context('When the company has both address types', () => {
    beforeEach(() => {
      cy.mount(
        <BillingAddress
          company={COMPANY_BOTH_ADDRESSES}
          order={orderNoAddress}
        />
      )
    })

    it('should render the heading', () => {
      cy.get('[data-test=billing-address-heading]')
        .should('exist')
        .should('have.text', 'Billing address')
    })

    it('should render the registered address', () => {
      cy.get('[data-test="invoice-address"]')
        .should('exist')
        .should(
          'have.text',
          'Registered Address line 1Registered Address line 2Registered townTest Registered CountyRegistered postcodeTest Registered Country'
        )
    })

    it('should render the inset text', () => {
      cy.get('[data-test="company-address-inset"]')
        .should('exist')
        .should(
          'have.text',
          "The company's address is currently being used for the invoice.Add a different billing address"
        )
    })

    it('should render the link for the billing address form', () => {
      cy.get('[data-test="billing-address-link"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          `${urls.omis.edit.billingAddress(
            orderNoAddress.id
          )}?returnUrl=${urls.omis.edit.invoiceDetails(orderNoAddress.id)}`
        )
    })
  })

  context('When the OMIS order has a billing address', () => {
    beforeEach(() => {
      cy.mount(
        <BillingAddress
          company={COMPANY_BOTH_ADDRESSES}
          order={orderWithAddress}
        />
      )
    })

    it('should render the heading', () => {
      cy.get('[data-test=billing-address-heading]')
        .should('exist')
        .should('have.text', 'Billing address')
    })

    it('should render the order billing address', () => {
      cy.get('[data-test="invoice-address"]')
        .should('exist')
        .should(
          'have.text',
          'OMIS line 1OMIS townOMIS countyOMIS postcodeOMIS Country'
        )
    })

    it('should not render the inset text', () => {
      cy.get('[data-test="company-address-inset"]').should('not.exist')
      cy.get('[data-test="billing-address-link"]').should('not.exist')
    })

    it('should render the link for the billing address form', () => {
      cy.get('[data-test="order-billing-address"]')
        .should('exist')
        .should('have.text', 'Change billing address')
        .should(
          'have.attr',
          'href',
          `${urls.omis.edit.billingAddress(
            orderNoAddress.id
          )}?returnUrl=${urls.omis.edit.invoiceDetails(orderNoAddress.id)}`
        )
    })
  })
})
