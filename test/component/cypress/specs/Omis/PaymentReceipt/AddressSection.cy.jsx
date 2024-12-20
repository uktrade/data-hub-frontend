import React from 'react'

import { AddressSection } from '../../../../../../src/client/modules/Omis/PaymentReceipt'

const paymentDate = '2005-05-04T08:59:20.381047'

const invoiceComplete = {
  billingContactName: 'Andreas Test',
  billingAddress1: 'Test Line 1',
  billingAddress2: 'Test Line 2',
  billingAddressTown: 'Test Town',
  billingAddressCounty: 'Test County',
  billingAddressPostcode: 'PO5 1DE',
  billingAddressCountry: {
    name: 'Test Country',
  },
  poNumber: 'Test PO Number',
  invoiceCompanyName: 'Test Company Name',
  invoiceAddress1: 'Invoice Line 1',
  invoiceAddress2: 'Invoice Line 2',
  invoiceAddressTown: 'Invoice Town',
  invoiceAddressCounty: 'Invoice County',
  invoiceAddressPostcode: 'NV0 1CE',
  invoiceAddressCountry: {
    name: 'Invoice Country',
  },
  invoiceVatNumber: 'Invoice VAT Number',
}

const invoiceIncomplete = {
  billingAddress1: 'Test Line 1',
  billingAddressTown: 'Test Town',
  billingAddressPostcode: 'PO5 1DE',
  billingAddressCountry: {
    name: 'Test Country',
  },
  invoiceAddress1: 'Invoice Line 1',
  invoiceAddressTown: 'Invoice Town',
  invoiceAddressPostcode: 'NV0 1CE',
  invoiceAddressCountry: {
    name: 'Invoice Country',
  },
}

const assertAddress = (address, dataTest) => {
  const selector = `[data-test="${dataTest}"]`
  if (address) {
    address.map((line, index) => {
      cy.get(selector)
        .find(`li:nth-child(${index + 1})`)
        .should('have.text', line)
    })
  } else if (address === null) {
    cy.get(selector).should('not.exist')
  }
}

describe('AddressSection', () => {
  context('When the invoice has all the fields', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mount(
        <AddressSection invoice={invoiceComplete} paymentDate={paymentDate} />
      )
    })

    it('should render the billing address with all fields visible', () => {
      cy.get('[data-test="attention-heading"]')
        .should('exist')
        .should('have.text', 'For the attention of')

      assertAddress(
        [
          'Andreas Test',
          'Test Line 1',
          'Test Line 2',
          'Test Town',
          'Test County',
          'PO5 1DE',
          'Test Country',
        ],
        'billing-address'
      )
    })

    it('should render the PO number', () => {
      cy.get('[data-test="po-number-heading"]')
        .should('exist')
        .should('have.text', 'Purchase order (PO) number')
      cy.get('[data-test="po-number"]')
        .should('exist')
        .should('have.text', invoiceComplete.poNumber)
    })

    it('should render the payment date', () => {
      cy.get('[data-test="receipt-date-heading"]')
        .should('exist')
        .should('have.text', 'Receipt date')
      cy.get('[data-test="receipt-date"]')
        .should('exist')
        .should('have.text', '4 May 2005')
    })

    it('should render the company address with all fields visible', () => {
      cy.get('[data-test="charging-point-heading"]')
        .should('exist')
        .should('have.text', 'From (charging point)')

      assertAddress(
        [
          'Test Company Name',
          'Invoice Line 1',
          'Invoice Line 2',
          'Invoice Town',
          'Invoice County',
          'NV0 1CE',
          'Invoice Country',
        ],
        'company-address'
      )
    })

    it('should render the VAT number', () => {
      cy.get('[data-test="vat-number-heading"]')
        .should('exist')
        .should('have.text', 'VAT number')
      cy.get('[data-test="vat-number"]')
        .should('exist')
        .should('have.text', invoiceComplete.invoiceVatNumber)
    })
  })

  context('When the invoice has all the fields but no payment date', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mount(
        <AddressSection invoice={invoiceIncomplete} paymentDate={null} />
      )
    })

    it('should not render the receipt date', () => {
      cy.get('[data-test="receipt-date"]').should('not.exist')
    })
  })

  context('When the invoice does not have all the fields', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mount(
        <AddressSection invoice={invoiceIncomplete} paymentDate={paymentDate} />
      )
    })

    it('should only render the available billing address fields', () => {
      cy.get('[data-test="attention-heading"]')
        .should('exist')
        .should('have.text', 'For the attention of')

      assertAddress(
        ['Test Line 1', 'Test Town', 'PO5 1DE', 'Test Country'],
        'billing-address'
      )
    })

    it('should render the payment date', () => {
      cy.get('[data-test="receipt-date-heading"]')
        .should('exist')
        .should('have.text', 'Receipt date')
      cy.get('[data-test="receipt-date"]')
        .should('exist')
        .should('have.text', '4 May 2005')
    })

    it('should render the company address with all fields visible', () => {
      cy.get('[data-test="charging-point-heading"]')
        .should('exist')
        .should('have.text', 'From (charging point)')

      assertAddress(
        ['Invoice Line 1', 'Invoice Town', 'NV0 1CE', 'Invoice Country'],
        'company-address'
      )
    })

    it('should not render the missing fields', () => {
      cy.get('[data-test="po-number-heading"]').should('not.exist')
      cy.get('[data-test="po-number"]').should('not.exist')
      cy.get('[data-test="vat-number-heading"]').should('not.exist')
      cy.get('[data-test="vat-number"]').should('not.exist')
    })
  })
})
