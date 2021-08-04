const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Load reconciliation collection view', () => {
  before(() => {
    const queryParams = '?sortby=created_on%3Adesc&status=quote_accepted'
    cy.visit(`${urls.omis.reconciliation()}${queryParams}`)
  })

  it('should display a list of orders', () => {
    cy.get(selectors.entityCollection.collection)
      .should('contain', 'MJF388/19')
      .and('contain', 'Andy and Lou')
      .and('contain', '£1,234,567.89')
      .and('contain', 'Quote accepted')
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
