import React from 'react'

import {
  QuoteNotAcceptedMessage,
  OrderCancelledMessage,
  OrderPaidMessage,
} from '../../../../../../src/client/modules/Omis/PaymentReconciliation'

const orderId = '12345'

describe('PaymentReconciliation messages', () => {
  context('QuoteNotAcceptedMessage', () => {
    beforeEach(() => {
      cy.mount(<QuoteNotAcceptedMessage id={orderId} />)
    })

    it('should render the message', () => {
      cy.get('[data-test=status-message]')
        .should('exist')
        .should(
          'have.text',
          'The quote for this order has not been accepted so payment cannot be reconciled.'
        )
    })

    it('should render the return link', () => {
      cy.get('[data-test="return-link"]')
        .should('exist')
        .should('have.text', 'Return')
        .should('have.attr', 'href')
    })
  })

  context('OrderCancelledMessage', () => {
    beforeEach(() => {
      cy.mount(<OrderCancelledMessage id={orderId} />)
    })

    it('should render the message', () => {
      cy.get('[data-test=status-message]')
        .should('exist')
        .should(
          'have.text',
          'This order has been cancelled and it is no longer possible to reconcile the payment.'
        )
    })

    it('should render the return link', () => {
      cy.get('[data-test="return-link"]')
        .should('exist')
        .should('have.text', 'Return')
        .should('have.attr', 'href')
    })
  })

  context('OrderPaidMessage', () => {
    beforeEach(() => {
      cy.mount(<OrderPaidMessage id={orderId} />)
    })

    it('should render the message', () => {
      cy.get('[data-test=status-message]')
        .should('exist')
        .should('have.text', 'This order has been paid in full.')
    })

    it('should render the reciept button', () => {
      cy.get('[data-test="view-receipt-button"]')
        .should('exist')
        .should('have.text', 'View payment receipt')
    })

    it('should render the return link', () => {
      cy.get('[data-test="return-link"]')
        .should('exist')
        .should('have.text', 'Return')
        .should('have.attr', 'href')
    })
  })
})
