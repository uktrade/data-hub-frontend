import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import { assertFlashMessage, assertPayload } from '../../support/assertions'

const { emptyOrder } = fixtures.omis

describe('View edit invoice details', () => {
  before(() => {
    cy.visit(urls.omis.edit.invoiceDetails(emptyOrder.id))
  })

  it('should submit form successfully', () => {
    cy.intercept('PATCH', `/api-proxy/v3/omis/order/${emptyOrder.id}`).as(
      'apiRequest'
    )
    cy.get('[data-test="vat-status-eu-company"]').click()
    cy.get('[data-test="vat-number-input"]').type('DE123456789')
    cy.get('[data-test="po-number-input"]').type('purchase order number')
    cy.get('[data-test="vat-verified-yes"]').click()
    cy.get('[data-test=submit-button]').click()
    assertPayload('@apiRequest', {
      id: emptyOrder.id,
      vat_status: 'eu',
      vat_number: 'DE123456789',
      vat_verified: true,
      po_number: 'purchase order number',
    })
    assertFlashMessage('Invoice details updated')
    cy.location('pathname').should('eq', urls.omis.workOrder(emptyOrder.id))
  })
})
