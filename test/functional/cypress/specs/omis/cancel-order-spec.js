import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import {
  assertErrorSummary,
  assertFieldRadios,
  assertFlashMessage,
  assertPayload,
} from '../../support/assertions'

const { draftOrder } = fixtures.omis

describe('Cancel order', () => {
  beforeEach(() => {
    cy.visit(urls.omis.cancel(draftOrder.id))
  })

  it('should render the cancellation form', () => {
    cy.get('[data-test="field-cancellation_reason"]').then((element) => {
      assertFieldRadios({
        element,
        label: 'Reason for cancelling',
        optionsCount: 8,
      })
    })
  })

  it('should display the error message if no reason is given', () => {
    cy.get('[data-test=submit-button]').click()
    assertErrorSummary([
      'Please select the reason why this order is being cancelled',
    ])
  })

  it('should submit form successfully', () => {
    cy.intercept('POST', `/api-proxy/v3/omis/order/${draftOrder.id}/cancel`).as(
      'apiRequest'
    )
    cy.get('[data-test="cancellation-reason-company-has-not-paid"]').click()
    cy.get('[data-test=submit-button]').click()
    assertPayload('@apiRequest', {
      id: draftOrder.id,
      cancellation_reason: 'fae5a84b-c7ef-e311-8a2b-e4115bead28a',
    })
    assertFlashMessage('Order cancelled')
    cy.location('pathname').should('eq', urls.omis.workOrder(draftOrder.id))
  })
})
