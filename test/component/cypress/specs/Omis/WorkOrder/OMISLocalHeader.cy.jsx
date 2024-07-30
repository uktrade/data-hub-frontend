import React from 'react'

import OMISLocalHeader from '../../../../../../src/client/modules/Omis/OMISLocalHeader'
import { orderFaker } from '../../../../../functional/cypress/fakers/orders'
import { STATUS } from '../../../../../../src/client/modules/Omis/constants'
import {
  formatMediumDateTime,
  getDifferenceInWords,
} from '../../../../../../src/client/utils/date'
import {
  assertLink,
  assertLinkWithText,
} from '../../../../../functional/cypress/support/assertions'
import urls from '../../../../../../src/lib/urls'

const assertLocalHeaderDetails = (index, label, value) => {
  cy.get('[data-test="localHeaderDetails"]>li')
    .eq(index)
    .should('contain', label)
    .and('contain', value)
}

const assertCompany = (companyName) =>
  assertLocalHeaderDetails(0, 'Company', companyName)

const assertMarket = (marketName) =>
  assertLocalHeaderDetails(1, 'Country (market)', marketName)

const assertUkRegion = (region) =>
  assertLocalHeaderDetails(2, 'UK region', region)

const assertCreatedOn = (index, date) =>
  assertLocalHeaderDetails(index, 'Created on', formatMediumDateTime(date))

const assertUpdatedOn = (index, date) =>
  assertLocalHeaderDetails(index, 'Updated on', formatMediumDateTime(date))

const assertStatus = (index, status) =>
  assertLocalHeaderDetails(index, 'Status', status)

const assertCompanyLink = (companyId) =>
  it('should render the company link', () => {
    assertLink('company-link', urls.companies.details(companyId))
  })

const assertCancelLink = (orderId) =>
  it('should render the cancel link', () => {
    assertLinkWithText('cancel-link', urls.omis.cancel(orderId), 'Cancel order')
  })

const assertViewQuoteLink = (orderId) =>
  it('should render the view quote link', () => {
    assertLinkWithText('quote-link', urls.omis.quote(orderId), 'View quote')
  })

const assertReceiptLink = (orderId) =>
  it('should render the view receipt link', () => {
    assertLinkWithText(
      'receipt-link',
      urls.omis.paymentReceipt(orderId),
      'View payment receipt'
    )
  })

const draftOrder = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.DRAFT,
  createdOn: '2018-07-26T14:08:36.380979',
  modifiedOn: '2018-08-16T14:18:28.328729',
  ukRegion: {
    name: 'East Midlands',
  },
})

const quoteAwaitingOrder = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.QUOTE_AWAITING_ACCEPTANCE,
  createdOn: '2017-07-26T14:08:36.380979',
  modifiedOn: '2017-08-16T14:18:28.328729',
  ukRegion: null,
})

const quoteAcceptedOrder = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.QUOTE_ACCEPTED,
  createdOn: '2019-07-26T14:08:36.380979',
  modifiedOn: '2019-08-16T14:18:28.328729',
  ukRegion: { name: 'All' },
})

const paidOrder = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.PAID,
  createdOn: '2020-07-26T14:08:36.380979',
  modifiedOn: '2020-08-16T14:18:28.328729',
  ukRegion: { name: 'West Midlands' },
})

const completeOrder = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.COMPLETE,
  createdOn: '2021-07-26T14:08:36.380979',
  modifiedOn: '2022-08-16T14:18:28.328729',
  ukRegion: { name: 'East of England' },
  completedOn: '2023-11-06T14:18:28.328729',
})

const completeOrderNoDate = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.COMPLETE,
  createdOn: '2021-07-26T14:08:36.380979',
  modifiedOn: '2022-08-16T14:18:28.328729',
  ukRegion: { name: 'East of England' },
  completedOn: null,
})

const cancelledOrder = orderFaker({
  id: 111,
  primaryMarket: {
    name: 'The Bahamas',
  },
  status: STATUS.CANCELLED,
  createdOn: '2023-07-26T14:08:36.380979',
  modifiedOn: '2023-08-16T14:18:28.328729',
  ukRegion: { name: 'Isle of Man' },
})

const quote = {
  expiresOn: '2107-07-26T14:08:36.380979',
}

const expiredQuote = {
  expiresOn: '1207-07-26T14:08:36.380979',
}

describe('OMISLocalHeader', () => {
  context('When the order status is draft', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader
          incompleteFields={[]}
          order={draftOrder}
          quote={null}
        />
      )
    })

    it('should render the order details', () => {
      assertCompany(draftOrder.company.name)
      assertMarket(draftOrder.primaryMarket.name)
      assertUkRegion(draftOrder.ukRegion.name)
      assertCreatedOn(3, draftOrder.createdOn)
      assertUpdatedOn(4, draftOrder.modifiedOn)
      assertStatus(5, 'Draft')
    })

    assertCompanyLink(draftOrder.company.id)

    it('should render the preview quote button', () => {
      cy.get('[data-test="preview-quote-button"]')
        .should('exist')
        .should('have.text', 'Preview quote')
        .should('have.attr', 'href', urls.omis.quote(draftOrder.id))
    })

    assertCancelLink(draftOrder.id), 'Cancel order'
  })

  context('When the order status is draft and has incomplete fields', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader
          order={draftOrder}
          quote={null}
          incompleteFields={['test']}
        />
      )
    })

    it('should render the order details', () => {
      assertCompany(draftOrder.company.name)
      assertMarket(draftOrder.primaryMarket.name)
      assertUkRegion(draftOrder.ukRegion.name)
      assertCreatedOn(3, draftOrder.createdOn)
      assertUpdatedOn(4, draftOrder.modifiedOn)
      assertStatus(5, 'Draft')
    })

    assertCompanyLink(draftOrder.company.id)

    it('should render the disabled preview quote button', () => {
      cy.get('[data-test="preview-quote-button-disabled"]')
        .should('exist')
        .should('have.text', 'Preview quote')
        .should('have.attr', 'disabled', 'disabled')
    })

    assertCancelLink(draftOrder.id), 'Cancel order'
  })

  context('When the order status is quote awaiting acceptance', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader order={quoteAwaitingOrder} quote={quote} />
      )
    })

    it('should render the order details', () => {
      assertCompany(quoteAwaitingOrder.company.name)
      assertMarket(quoteAwaitingOrder.primaryMarket.name)
      assertCreatedOn(2, quoteAwaitingOrder.createdOn)
      assertUpdatedOn(3, quoteAwaitingOrder.modifiedOn)
      assertStatus(
        4,
        `Quote awaiting acceptance (expires ${getDifferenceInWords(
          quote.expiresOn
        )})`
      )
    })

    assertCompanyLink(quoteAwaitingOrder.company.id)
    assertViewQuoteLink(quoteAwaitingOrder.id)
    assertCancelLink(quoteAwaitingOrder.id)
  })

  context(
    'When the order status is quote awaiting acceptance and the quote has expired',
    () => {
      beforeEach(() => {
        cy.viewport(1024, 768)
        cy.mountWithProvider(
          <OMISLocalHeader order={quoteAwaitingOrder} quote={expiredQuote} />
        )
      })

      it('should render the order details', () => {
        assertCompany(quoteAwaitingOrder.company.name)
        assertMarket(quoteAwaitingOrder.primaryMarket.name)
        assertCreatedOn(2, quoteAwaitingOrder.createdOn)
        assertUpdatedOn(3, quoteAwaitingOrder.modifiedOn)
        assertStatus(
          4,
          `Quote awaiting acceptance (expired ${getDifferenceInWords(
            expiredQuote.expiresOn
          )})`
        )
      })

      assertCompanyLink(quoteAwaitingOrder.company.id)
      assertViewQuoteLink(quoteAwaitingOrder.id)
      assertCancelLink(quoteAwaitingOrder.id)
    }
  )

  context('When the order status is quote accepted', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader order={quoteAcceptedOrder} quote={null} />
      )
    })

    it('should render the order details', () => {
      assertCompany(quoteAcceptedOrder.company.name)
      assertMarket(quoteAcceptedOrder.primaryMarket.name)
      assertUkRegion(quoteAcceptedOrder.ukRegion.name)
      assertCreatedOn(3, quoteAcceptedOrder.createdOn)
      assertUpdatedOn(4, quoteAcceptedOrder.modifiedOn)
      assertStatus(5, 'Quote accepted')
    })

    assertCompanyLink(quoteAcceptedOrder.company.id)
    assertViewQuoteLink(quoteAcceptedOrder.id)
  })

  context('When the order status is paid', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(<OMISLocalHeader order={paidOrder} quote={null} />)
    })

    it('should render the order details', () => {
      assertCompany(paidOrder.company.name)
      assertMarket(paidOrder.primaryMarket.name)
      assertUkRegion(paidOrder.ukRegion.name)
      assertCreatedOn(3, paidOrder.createdOn)
      assertUpdatedOn(4, paidOrder.modifiedOn)
      assertStatus(5, 'Paid')
    })

    assertCompanyLink(paidOrder.company.id)

    it('should render the complete order button', () => {
      cy.get('[data-test="complete-button"]')
        .should('exist')
        .should('have.text', 'Complete order')
        .should('have.attr', 'href', urls.omis.complete(paidOrder.id))
    })

    assertReceiptLink(paidOrder.id)
    assertViewQuoteLink(paidOrder.id)
  })

  context('When the order status is complete', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader order={completeOrder} quote={null} />
      )
    })

    it('should render the order details', () => {
      assertCompany(completeOrder.company.name)
      assertMarket(completeOrder.primaryMarket.name)
      assertUkRegion(completeOrder.ukRegion.name)
      assertCreatedOn(3, completeOrder.createdOn)
      assertUpdatedOn(4, completeOrder.modifiedOn)
      assertStatus(
        5,
        `Completed (${getDifferenceInWords(completeOrder.completedOn)})`
      )
    })

    assertCompanyLink(completeOrder.company.id)
    assertReceiptLink(completeOrder.id)
    assertViewQuoteLink(completeOrder.id)
  })

  context('When the order is a legacy order and the status is complete', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader order={completeOrderNoDate} quote={null} />
      )
    })

    it('should render the order details', () => {
      assertCompany(completeOrderNoDate.company.name)
      assertMarket(completeOrderNoDate.primaryMarket.name)
      assertUkRegion(completeOrderNoDate.ukRegion.name)
      assertCreatedOn(3, completeOrderNoDate.createdOn)
      assertUpdatedOn(4, completeOrderNoDate.modifiedOn)
      assertStatus(5, 'Complete')
    })
  })

  context('When the order status is cancelled', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <OMISLocalHeader order={cancelledOrder} quote={null} />
      )
    })

    it('should render the order details', () => {
      assertCompany(cancelledOrder.company.name)
      assertMarket(cancelledOrder.primaryMarket.name)
      assertUkRegion(cancelledOrder.ukRegion.name)
      assertCreatedOn(3, cancelledOrder.createdOn)
      assertUpdatedOn(4, cancelledOrder.modifiedOn)
      assertStatus(5, 'Cancelled')
    })

    assertCompanyLink(cancelledOrder.company.id)
    assertViewQuoteLink(cancelledOrder.id)
  })
})
