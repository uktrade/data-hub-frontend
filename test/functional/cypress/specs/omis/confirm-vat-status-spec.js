import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import { assertFlashMessage, assertPayload } from '../../support/assertions'

const { quoteAwaitOrder } = fixtures.omis

describe('View edit invoice details', () => {
  beforeEach(() => {
    cy.visit(urls.omis.edit.vatStatus(quoteAwaitOrder.id))
  })

  it('should render the status message', () => {
    cy.get('[data-test="billing-country-message"]').should(
      'have.text',
      'The billing country has been changed.Confirm the VAT status for United Kingdom.'
    )
  })

  it('should submit form successfully', () => {
    cy.intercept('PATCH', `/api-proxy/v3/omis/order/${quoteAwaitOrder.id}`).as(
      'apiRequest'
    )
    cy.get('[data-test="vat-status-eu-company"]').click()
    cy.get('[data-test="vat-number-input"]').type('DE123456789')
    cy.get('[data-test="vat-verified-yes"]').click()
    cy.get('[data-test=submit-button]').click()
    assertPayload('@apiRequest', {
      id: quoteAwaitOrder.id,
      vat_status: 'eu',
      vat_number: 'DE123456789',
      vat_verified: true,
    })
    assertFlashMessage('Billing address and VAT status updated')
    cy.location('pathname').should(
      'eq',
      urls.omis.edit.invoiceDetails(quoteAwaitOrder.id)
    )
  })
})
