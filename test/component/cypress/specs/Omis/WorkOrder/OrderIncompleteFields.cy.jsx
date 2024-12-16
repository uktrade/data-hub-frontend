import React from 'react'

import OrderIncompleteFields from '../../../../../../src/client/modules/Omis/OrderIncompleteFields'
import {
  INCOMPLETE_FIELD_MESSAGES,
  STATUS,
  VAT_STATUS,
} from '../../../../../../src/client/modules/Omis/constants'
import urls from '../../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_COMPACT,
} from '../../../../../../src/client/utils/date-utils'

const quoteAwaitingOrder = {
  id: '123',
  status: STATUS.QUOTE_AWAITING_ACCEPTANCE,
}

const cancelledOrder = {
  id: '123',
  status: STATUS.CANCELLED,
  cancelledBy: {
    name: 'Andreas Test',
  },
  cancelledOn: '2018-07-26T14:08:36.380979',
  cancellationReason: {
    name: 'Work transferred to Overseas Partner',
  },
}

const draftOrder = {
  id: '123',
  status: STATUS.DRAFT,
  serviceTypes: [],
}

const draftBaseEUOrder = {
  id: '123',
  status: STATUS.DRAFT,
  description: 'test',
  deliveryDate: '2108-07-26T14:08:36.380979',
  serviceTypes: ['test service type'],
  vatStatus: VAT_STATUS.EU_COMPANY,
}

const draftEUOrder = { ...draftBaseEUOrder, ...{ vatVerified: false } }

const draftOrderAllFields = {
  ...draftBaseEUOrder,
  ...{ vatNumber: 'test', vatVerified: true },
}

const assignees = [{ estimatedTime: 60, isLead: true }]

describe('OrderIncompleteFields', () => {
  context('When the order status is quote awaiting acceptance', () => {
    beforeEach(() => {
      cy.mount(<OrderIncompleteFields order={quoteAwaitingOrder} />)
    })

    it('should render the correct status message', () => {
      cy.get('[data-test="withdraw-quote-message"]')
        .should('exist')
        .should(
          'have.text',
          'You cannot edit the order once a quote has been sent.Withdraw the quote to edit the order.'
        )
    })

    it('should render the withdraw quote link', () => {
      cy.get('[data-test="withdraw-quote-link"]')
        .should('exist')
        .should('have.attr', 'href', urls.omis.quote(quoteAwaitingOrder.id))
    })
  })

  context('When the order status is cancelled', () => {
    beforeEach(() => {
      cy.mount(<OrderIncompleteFields order={cancelledOrder} />)
    })

    it('should render the correct status message', () => {
      cy.get('[data-test="archive-panel"]').should('exist')
      cy.get('[data-test="archive-message"]')
        .should('exist')
        .should(
          'have.text',
          `This order was cancelled on ${formatDate(
            cancelledOrder.cancelledOn,
            DATE_FORMAT_COMPACT
          )} by ${cancelledOrder.cancelledBy.name}.`
        )
      cy.get('[data-test="archive-reason"]')
        .should('exist')
        .should(
          'have.text',
          `Reason: ${cancelledOrder.cancellationReason.name}`
        )
    })
  })

  context('When the order status is draft and has no fields', () => {
    beforeEach(() => {
      cy.mount(<OrderIncompleteFields order={draftOrder} assignees={[]} />)
    })

    it('should render the description message', () => {
      cy.get('[data-test="add-a-description-of-the-work-or-activity-link"]')
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.DESCRIPTION)
        .should('have.attr', 'href', urls.omis.edit.quote(draftOrder.id))
    })

    it('should render the delivery date message', () => {
      cy.get(
        '[data-test="set-a-delivery-date-of-at-least-21-days-from-now-link"]'
      )
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.DELIVERY_DATE)
        .should('have.attr', 'href', urls.omis.edit.quote(draftOrder.id))
    })

    it('should render the service types message', () => {
      cy.get(
        '[data-test="choose-at-least-one-service-type-the-order-covers-link"]'
      )
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.SERVICE_TYPES)
        .should('have.attr', 'href', urls.omis.edit.internalInfo(draftOrder.id))
    })

    it('should render the VAT category message', () => {
      cy.get('[data-test="choose-a-vat-category-link"]')
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.VAT_STATUS)
        .should(
          'have.attr',
          'href',
          urls.omis.edit.invoiceDetails(draftOrder.id)
        )
    })

    it('should render the assignees message', () => {
      cy.get('[data-test="add-at-least-one-adviser-in-the-market-link"]')
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.ASSIGNEES)
        .should('have.attr', 'href', urls.omis.edit.assignees(draftOrder.id))
    })

    it('should render the assignee time message', () => {
      cy.get(
        '[data-test="allocate-hours-to-at-least-one-adviser-in-the-market-link"]'
      )
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.ASSIGNEE_TIME)
        .should('have.attr', 'href', urls.omis.edit.assigneeTime(draftOrder.id))
    })

    it('should render the lead adviser message', () => {
      cy.get('[data-test="incomplete-fields-message"]').should(
        'contain',
        INCOMPLETE_FIELD_MESSAGES.LEAD_ASSIGNEE
      )
    })
  })

  context('When the order status is draft and has the EU VAT status', () => {
    beforeEach(() => {
      cy.mount(
        <OrderIncompleteFields order={draftEUOrder} assignees={assignees} />
      )
    })

    it('should render the VAT number message', () => {
      cy.get('[data-test="enter-the-eu-companys-vat-number-link"]')
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.VAT_NUMBER)
        .should(
          'have.attr',
          'href',
          urls.omis.edit.invoiceDetails(draftEUOrder.id)
        )
    })

    it('should render the VAT verified message', () => {
      cy.get('[data-test="verify-the-eu-companys-vat-number-link"]')
        .should('exist')
        .should('have.text', INCOMPLETE_FIELD_MESSAGES.VAT_VERIFIED)
        .should(
          'have.attr',
          'href',
          urls.omis.edit.invoiceDetails(draftEUOrder.id)
        )
    })

    it('should not render any other messages', () => {
      cy.get(
        '[data-test="add-a-description-of-the-work-or-activity-link"]'
      ).should('not.exist')

      cy.get(
        '[data-test="set-a-delivery-date-of-at-least-21-days-from-now-link"]'
      ).should('not.exist')
      cy.get(
        '[data-test="choose-at-least-one-service-type-the-order-covers-link"]'
      ).should('not.exist')
      cy.get('[data-test="choose-a-vat-category-link"]').should('not.exist')

      cy.get(
        '[data-test="add-at-least-one-adviser-in-the-market-link"]'
      ).should('not.exist')

      cy.get(
        '[data-test="allocate-hours-to-at-least-one-adviser-in-the-market-link"]'
      ).should('not.exist')

      cy.get('[data-test="incomplete-fields-message"]').should(
        'not.contain',
        INCOMPLETE_FIELD_MESSAGES.LEAD_ASSIGNEE
      )
    })
  })

  context('When the order status is draft and has all the fields', () => {
    beforeEach(() => {
      cy.mount(
        <OrderIncompleteFields
          order={draftOrderAllFields}
          assignees={assignees}
        />
      )
    })

    it('should not render anything', () => {
      cy.get('[data-test="incomplete-fields-message"]').should('not.exist')
    })
  })
})
