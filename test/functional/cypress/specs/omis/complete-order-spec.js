import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import { assertFlashMessage, assertPayload } from '../../support/assertions'

const { draftOrder } = fixtures.omis

describe('Edit order assignee time', () => {
  before(() => {
    cy.visit(urls.omis.complete(draftOrder.id))
  })

  it('should submit form successfully', () => {
    cy.intercept(
      'PATCH',
      `/api-proxy/v3/omis/order/${draftOrder.id}/assignee`
    ).as('apiRequest')
    cy.get('[data-test="adviser-0-input"]').type('55')
    cy.get('[data-test="adviser-1-input"]').type('1')
    cy.get('[data-test="checkbox-Yes"]').click()
    cy.get('[data-test=submit-button]').click()
    assertPayload('@apiRequest', [
      {
        adviser: {
          id: '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e',
        },
        actual_time: 3300,
      },
      {
        adviser: {
          id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
        },
        actual_time: 60,
      },
    ])
    assertFlashMessage('Order completed')
    cy.location('pathname').should('eq', urls.omis.workOrder(draftOrder.id))
  })
})
