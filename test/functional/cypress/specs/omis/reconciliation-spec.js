const fixtures = require('../../fixtures')
const { omis } = require('../../../../../src/lib/urls')
const { orderFaker } = require('../../fakers/orders')
const {
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertBadge,
  assertMetadataItem,
  assertMetadataItemNotPresent,
  assertOMISSumary,
  assertItemLink,
  assertUpdatedOn,
} = require('../../support/collection-list-assertions')
const {
  assertFlashMessage,
  assertErrorSummary,
  assertPayload,
} = require('../../support/assertions')
const { omisCollectionListRequest } = require('../../support/actions')

const quoteAccepted = fixtures.omis.quoteAccepted

describe('Reconciliation collection list', () => {
  const order = orderFaker({
    id: 111,
    reference: 'MJF388/19',
    company: {
      name: 'Andy and Lou',
    },
    contact: {
      name: 'Andreas Test',
    },
    status: 'quote_accepted',
    subtotal_cost: 1005,
    total_cost: 2005,
    modified_on: '2020-12-11T01:28:26.124Z',
    payment_due_date: '2021-12-11T01:28:26.124Z',
  })

  const ordersList = [order]

  beforeEach(() => {
    omisCollectionListRequest(
      'v3/search/order',
      ordersList,
      omis.reconciliation(),
      123456789
    )
    getCollectionList()
  })

  assertCollectionBreadcrumbs('Orders (OMIS)')

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Orders (OMIS)')
  })

  assertOMISSumary('Total value: £1,234,567.89')

  it('should display an order and render the expected items', () => {
    it('should have a link with the reference', () => {
      assertItemLink(
        '@firstListItem',
        'MJF388/19 (Order reference)',
        omis.paymentReconciliation(111)
      )
    })

    it('should contain "Quote accepted" badge', () => {
      assertBadge('@firstListItem', 'Quote accepted')
    })

    it('should render the updated date and time (modified_on)', () => {
      assertUpdatedOn('@firstListItem', 'Updated on 11 Dec 2020, 1:28am')
    })

    it('should render the payment due date', () => {
      assertMetadataItem('@firstListItem', 'Payment due date 11 Dec 2021')
    })

    it('should render the company name', () => {
      assertMetadataItem('@firstListItem', 'Company Andy and Lou')
    })

    it('should render the amount without VAT', () => {
      assertMetadataItem('@firstListItem', 'Amount (ex. VAT) £10.05')
    })

    it('should render the amount with VAT', () => {
      assertMetadataItem('@firstListItem', 'Amount (inc. VAT) £20.05')
    })

    it('should not render the contact name', () => {
      assertMetadataItemNotPresent('@firstListItem', 'Contact Andreas Test')
    })
  })
})

describe('Payment reconciliation form', () => {
  context('When viewing an order where the quote has been accepted', () => {
    beforeEach(() => {
      cy.visit(omis.paymentReconciliation(quoteAccepted.id))
    })

    it('should render the help text', () => {
      cy.get('[data-test="something-wrong-details"]')
        .click()
        .should('contain', 'Is something wrong with the payment?')
        .should(
          'contain',
          'View the order to contact an adviser in the UK or contact omis.orders@digital.trade.gov.uk'
        )
    })

    it('should not submit the form with no values', () => {
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary([
        'Enter the amount recieved',
        'Enter the date the payment was recieved',
      ])
    })

    it('should not submit the form with invalid values', () => {
      cy.get('[data-test="amount-input"]').type('1')
      cy.get('[data-test="received_on-day"]').type('30')
      cy.get('[data-test="received_on-month"]').type('10')
      cy.get('[data-test="received_on-year"]').type('2100')
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary([
        'The amount must be equal to or larger than the invoice amount',
        'Payment received date must be in the past',
      ])
    })

    it('should submit the form', () => {
      cy.intercept(
        'POST',
        `/api-proxy/v3/omis/order/${quoteAccepted.id}/payment`
      ).as('apiRequest')

      cy.get('[data-test="amount-input"]').clear().type('1,234.56')
      cy.get('[data-test="received_on-day"]').clear().type('30')
      cy.get('[data-test="received_on-month"]').clear().type('10')
      cy.get('[data-test="received_on-year"]').clear().type('2020')
      cy.get('[data-test="submit-button"]').click()
      assertPayload('@apiRequest', [
        {
          amount: 123456,
          received_on: '2020-10-30',
        },
      ])
      assertFlashMessage(`Payment for ${quoteAccepted.reference} reconciled`)
    })
  })
})
