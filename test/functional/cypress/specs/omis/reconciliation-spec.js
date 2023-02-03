const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const { orderFaker } = require('../../fakers/orders')
const { assertBreadcrumbs } = require('../../support/assertions')

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
    cy.intercept('POST', '/api-proxy/v3/search/order', {
      body: {
        count: ordersList.length,
        results: ordersList,
        summary: {
          total_subtotal_cost: 123456789,
        },
      },
    }).as('apiRequest')
    cy.visit(urls.omis.reconciliation())
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstListItem')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      'Orders (OMIS)': null,
    })
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Orders (OMIS)')
  })

  it('should render the total value', () => {
    cy.get('[data-test=summary]')
      .should('exist')
      .should('contain', 'Total value: £1,234,567.89')
  })

  it('should display an order and render the expected items', () => {
    it('should have a link with the reference', () => {
      cy.get('@firstListItem')
        .find('h3')
        .children()
        .should('have.text', 'MJF388/19 (Order reference)')
        .should('have.attr', 'href', urls.omis.paymentReconciliation(111))
    })

    it('should contain "Quote accepted" badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .eq(0)
        .should('have.text', 'Quote accepted')
    })

    it('should render the updated date and time (modified_on)', () => {
      cy.get('@firstListItem')
        .find('h4')
        .should('have.text', 'Updated on 11 Dec 2020, 1:28am')
    })

    it('should render the payment due date', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('have.text', 'Payment due date 11 Dec 2021')
    })

    it('should render the company name', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('have.text', 'Company Andy and Lou')
    })

    it('should render the amount without VAT', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should('have.text', 'Amount (ex. VAT) £10.05')
    })

    it('should render the amount with VAT', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('have.text', 'Amount (inc. VAT) £20.05')
    })

    it('should not render the contact name', () => {
      cy.get('@firstListItem').should('not.contain', 'Contact Andreas Test')
    })
  })
})

describe('Create payment reconciliation', () => {
  before(() => {
    cy.visit(urls.omis.paymentReconciliation(fixtures.omis.quoteAccepted.id))
  })

  it('should reconcile payment', () => {
    cy.get('#field-amount').type('1,234.55')
    cy.get('#field-received_on').type('2020/10/30')
    cy.get('[data-test="submit"]').click()
    cy.get('.c-message').should('contain', 'Payment for SDE234/91 reconciled')
  })
})
