import React from 'react'

import { PaymentSection } from '../../../../../../src/client/modules/Omis/PaymentReceipt'
import urls from '../../../../../../src/lib/urls'

const payment = [
  {
    method: 'bacs',
    amount: '10000',
    receivedOn: '2005-05-04T08:59:20.381047',
    transactionReference: 'reference',
  },
]

const paymentNoRef = [
  {
    method: 'bacs',
    amount: '10000',
    receivedOn: '2005-05-04T08:59:20.381047',
  },
]

describe('PaymentSection', () => {
  context('When the reconciliation journey is set to true', () => {
    beforeEach(() => {
      cy.mount(
        <PaymentSection
          payment={payment}
          orderId="123"
          reconciliationJourney={true}
          handlePrint={null}
        />
      )
    })

    it('should render all the fields', () => {
      cy.get('[data-test="payment-section"]').should(
        'have.text',
        'Payment detailsMethodBACSAmount received£100Received on4 May 2005Transaction referencereferenceReconcile another orderPrint payment receipt'
      )
    })

    it('should render the correct links', () => {
      cy.get('[data-test="reconciliation-link"]')
        .should('exist')
        .should('have.text', 'Reconcile another order')
        .should('have.attr', 'href', urls.omis.reconciliation())
      cy.get('[data-test="order-link"]').should('not.exist')
      cy.get('[data-test="print-link"]')
        .should('exist')
        .should('have.text', 'Print payment receipt')
    })
  })

  context('When the reconciliation journey is set to false', () => {
    beforeEach(() => {
      cy.mount(
        <PaymentSection
          payment={paymentNoRef}
          orderId="123"
          reconciliationJourney={false}
          handlePrint={null}
        />
      )
    })

    it('should render all the fields', () => {
      cy.get('[data-test="payment-section"]').should(
        'have.text',
        'Payment detailsMethodBACSAmount received£100Received on4 May 2005Return to orderPrint payment receipt'
      )
    })

    it('should render the correct links', () => {
      cy.get('[data-test="reconciliation-link"]').should('not.exist')
      cy.get('[data-test="order-link"]')
        .should('exist')
        .should('have.attr', 'href', urls.omis.order('123'))
      cy.get('[data-test="print-link"]')
        .should('exist')
        .should('have.text', 'Print payment receipt')
    })
  })
})
