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
const { omisCollectionListRequest } = require('../../support/actions')

describe('Load reconciliation collection view', () => {
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

  before(() => {
    omisCollectionListRequest(
      'v3/search/order',
      ordersList,
      omis.reconciliation(),
      123456789
    )
  })

  beforeEach(() => {
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

describe('Create payment reconciliation', () => {
  before(() => {
    cy.visit(omis.paymentReconciliation(fixtures.omis.quoteAccepted.id))
  })

  it('should reconcile payment', () => {
    cy.get('#field-amount').type('1,234.55')
    cy.get('#field-received_on').type('2020/10/30')
    cy.get('[data-test="submit"]').click()
    cy.get('.c-message').should('contain', 'Payment for SDE234/91 reconciled')
  })
})
