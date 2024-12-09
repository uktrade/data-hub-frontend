import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import {
  assertBreadcrumbs,
  assertFlashMessage,
  assertLocalHeader,
} from '../../support/assertions'
import { formatMediumDateParsed } from '../../../../../src/client/utils/date'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'

const {
  cancelledOrder,
  draftOrder,
  quote,
  quoteAccepted,
  quoteAwaitOrder,
  quoteCancelled,
  quoteNotAccepted,
  quotePreview,
} = fixtures.omis

const assertSenderDetails = (quote) =>
  it('should display the sender information', () => {
    cy.get('[data-test="sent-on-heading"]')
      .should('exist')
      .should('have.text', 'Sent on')
    cy.get('[data-test="sent-on-date"]')
      .should('exist')
      .should(
        'have.text',
        formatDate(quote.created_on, DATE_FORMAT_MEDIUM_WITH_TIME)
      )
    cy.get('[data-test="sent-by-heading"]')
      .should('exist')
      .should('have.text', 'Sent by')
    cy.get('[data-test="sent-by-name"]')
      .should('exist')
      .should('have.text', quote.created_by.name)
  })

const assertAcceptanceDetails = (quote) =>
  it('should display the acceptance information', () => {
    cy.get('[data-test="accepted-on-heading"]')
      .should('exist')
      .should('have.text', 'Accepted on')
    cy.get('[data-test="accepted-on-date"]')
      .should('exist')
      .should(
        'have.text',
        formatDate(quote.accepted_on, DATE_FORMAT_MEDIUM_WITH_TIME)
      )
    cy.get('[data-test="accepted-by-heading"]')
      .should('exist')
      .should('have.text', 'Accepted by')
    cy.get('[data-test="accepted-by-name"]')
      .should('exist')
      .should('have.text', quote.accepted_by.name)
  })

const assertReturnLink = (orderId) =>
  it('should render the return link', () => {
    cy.get('[data-test="return-link"]')
      .should('exist')
      .should('have.text', 'Return to order')
      .should('have.attr', 'href', urls.omis.workOrder(orderId))
  })

describe('Order quote', () => {
  context('When viewing the quote preview for a draft order', () => {
    beforeEach(() => {
      cy.visit(urls.omis.quote(draftOrder.id))
    })

    it('should render the local header', () => {
      assertLocalHeader('Quote preview')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Orders (OMIS)': urls.omis.index(),
        [draftOrder.reference]: urls.omis.order(draftOrder.id),
        'Quote preview': '',
      })
    })

    it('should render the expiry date', () => {
      cy.get('[data-test="expiry-heading"]')
        .should('exist')
        .should('have.text', 'Will expire on')
      cy.get('[data-test="expiry-date"]')
        .should('exist')
        .should('have.text', formatMediumDateParsed(quotePreview.expires_on))
    })

    it('should display the warning message', () => {
      cy.get('[data-test="preview-warning"]')
        .should('exist')
        .should(
          'contain',
          'Quotes should be reviewed by a manager before being sent.'
        )
    })

    it('should display the contact email', () => {
      cy.get('[data-test="contact-email"]')
        .should('exist')
        .should(
          'have.text',
          'An email with a link to this quote will be sent to:contact@bob.com'
        )
    })

    it('should create the quote successfully', () => {
      cy.get('[data-test=submit-button]').click()
      assertFlashMessage('Quote sent to client')
      cy.location('pathname').should('eq', urls.omis.workOrder(draftOrder.id))
    })
  })

  context(
    'When viewing an order where the quote is awaiting acceptance',
    () => {
      beforeEach(() => {
        cy.visit(urls.omis.quote(quoteAwaitOrder.id))
      })

      it('should render the local header', () => {
        assertLocalHeader('Quote')
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.index(),
          'Orders (OMIS)': urls.omis.index(),
          [quoteAwaitOrder.reference]: urls.omis.order(quoteAwaitOrder.id),
          Quote: '',
        })
      })

      it('should render the expiry date', () => {
        cy.get('[data-test="expires-on-heading"]')
          .should('exist')
          .should('have.text', 'Expired on')
        cy.get('[data-test="expires-on-date"]')
          .should('exist')
          .should(
            'have.text',
            formatMediumDateParsed(quoteNotAccepted.expires_on)
          )
      })

      assertSenderDetails(quoteNotAccepted)

      it('should display the warning message', () => {
        cy.get('[data-test="awaiting-acceptance-warning"]')
          .should('exist')
          .should(
            'contain',
            'The client will no longer be able to accept the quote once it has been withdrawn.'
          )
          .should('contain', 'They will be notified by email.')
      })

      it('should withdraw the quote successfully', () => {
        cy.get('[data-test=submit-button]').click()
        assertFlashMessage('Quote withdrawn')
        cy.location('pathname').should(
          'eq',
          urls.omis.workOrder(quoteAwaitOrder.id)
        )
      })
    }
  )

  context('When the quote has been accepted', () => {
    beforeEach(() => {
      cy.visit(urls.omis.quote(quoteAccepted.id))
    })

    it('should render the local header', () => {
      assertLocalHeader('Quote')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Orders (OMIS)': urls.omis.index(),
        [quoteAccepted.reference]: urls.omis.order(quoteAccepted.id),
        Quote: '',
      })
    })

    assertSenderDetails(quote)
    assertAcceptanceDetails(quote)
    assertReturnLink(quoteAccepted.id)

    it('should not render any form actions', () => {
      cy.get('[data-test="submit-button"]').should('not.exist')
      cy.get('[data-test="cancel-button"]').should('not.exist')
    })
  })

  context('When the order has been cancelled', () => {
    beforeEach(() => {
      cy.visit(urls.omis.quote(cancelledOrder.id))
    })

    it('should render the local header', () => {
      assertLocalHeader('Quote')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        'Orders (OMIS)': urls.omis.index(),
        [cancelledOrder.reference]: urls.omis.order(cancelledOrder.id),
        Quote: '',
      })
    })

    assertSenderDetails(quoteCancelled)
    assertAcceptanceDetails(quoteCancelled)

    it('should display the cancellation information', () => {
      cy.get('[data-test="cancelled-on-heading"]')
        .should('exist')
        .should('have.text', 'Cancelled on')
      cy.get('[data-test="cancelled-on-date"]')
        .should('exist')
        .should(
          'have.text',
          formatDate(quoteCancelled.cancelled_on, DATE_FORMAT_MEDIUM_WITH_TIME)
        )
      cy.get('[data-test="cancelled-by-heading"]')
        .should('exist')
        .should('have.text', 'Cancelled by')
      cy.get('[data-test="cancelled-by-name"]')
        .should('exist')
        .should('have.text', quoteCancelled.cancelled_by.name)
    })

    assertReturnLink(cancelledOrder.id)

    it('should not render any form actions', () => {
      cy.get('[data-test="submit-button"]').should('not.exist')
      cy.get('[data-test="cancel-button"]').should('not.exist')
    })
  })
})
