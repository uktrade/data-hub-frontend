import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import { assertFlashMessage, assertPayload } from '../../support/assertions'
import { UNITED_KINGDOM_ID } from '../../../../../src/common/constants'

const { quoteAwaitOrder } = fixtures.omis

describe('View edit invoice details', () => {
  context('When the country is not changed', () => {
    before(() => {
      cy.visit(urls.omis.edit.billingAddress(quoteAwaitOrder.id))
    })

    it('should submit form successfully and redirect to the invoice details page', () => {
      cy.intercept(
        'PATCH',
        `/api-proxy/v3/omis/order/${quoteAwaitOrder.id}`
      ).as('apiRequest')
      cy.get('#country').select('United Kingdom')
      cy.get('[data-test="address-1-input"]').clear().type('123 Test Street')
      cy.get('[data-test="address-2-input"]').clear().type('Line 2 Address')
      cy.get('[data-test="city-input"]').clear().type('Test Town')
      cy.get('[data-test="county-input"]').clear().type('Test County')
      cy.get('[data-test="postcode-input"]').clear().type('TE5 5ST')
      cy.get('[data-test="submit-button"]').click()

      assertPayload('@apiRequest', {
        id: quoteAwaitOrder.id,
        billing_address_1: '123 Test Street',
        billing_address_2: 'Line 2 Address',
        billing_address_town: 'Test Town',
        billing_address_county: 'Test County',
        billing_address_postcode: 'TE5 5ST',
        billing_address_country: UNITED_KINGDOM_ID,
      })
      assertFlashMessage('Billing address updated')
      cy.location('pathname').should(
        'eq',
        urls.omis.edit.invoiceDetails(quoteAwaitOrder.id)
      )
    })
  })

  context('When the country is changed', () => {
    before(() => {
      cy.visit(urls.omis.edit.billingAddress(quoteAwaitOrder.id))
    })

    it('should submit form successfully and redirect to the VAT confirmation page', () => {
      cy.intercept(
        'PATCH',
        `/api-proxy/v3/omis/order/${quoteAwaitOrder.id}`
      ).as('apiRequest')
      cy.get('#country').select('Saudi Arabia')
      cy.get('[data-test="address-1-input"]').clear().type('123 Test Street')
      cy.get('[data-test="address-2-input"]').clear().type('Line 2 Address')
      cy.get('[data-test="city-input"]').clear().type('Test Town')
      cy.get('[data-test="county-input"]').clear().type('Test County')
      cy.get('[data-test="postcode-input"]').clear().type('TE5 5ST')
      cy.get('[data-test="submit-button"]').click()

      assertPayload('@apiRequest', {
        id: quoteAwaitOrder.id,
        billing_address_1: '123 Test Street',
        billing_address_2: 'Line 2 Address',
        billing_address_town: 'Test Town',
        billing_address_county: 'Test County',
        billing_address_postcode: 'TE5 5ST',
        billing_address_country: '1a0be5c4-5d95-e211-a939-e4115bead28a',
      })
      cy.location('pathname').should(
        'eq',
        urls.omis.edit.vatStatus(quoteAwaitOrder.id)
      )
    })
  })
})
