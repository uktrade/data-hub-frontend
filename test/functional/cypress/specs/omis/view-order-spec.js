const fixtures = require('../../fixtures/index')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const { cancelledOrder, draftOrder, paidOrder } = fixtures.omis
const {
  actionContainer,
  cancelOrder,
  completeOrder,
  previewQuote,
  viewPayment,
  viewQuote,
} = selectors.omisWorkOrder

const assertContainActions = (actions) => {
  actions.forEach((action) => {
    cy.get(action.link).should('contain', action.text)
  })
}

const assertNotContainActions = (actions) => {
  actions.forEach((action) => {
    cy.get(actionContainer).not('contain', action.text)
  })
}

describe('View draft order without payment', () => {
  before(() => {
    cy.visit(urls.omis.order(draftOrder.id))
  })

  it('displays expected draft actions', () => {
    assertContainActions([cancelOrder, previewQuote])
    assertNotContainActions([completeOrder, viewPayment, viewQuote])
  })
})

describe('View paid order', () => {
  before(() => {
    cy.visit(urls.omis.order(paidOrder.id))
  })

  it('displays expected actions for paid order', () => {
    assertContainActions([completeOrder, viewPayment, viewQuote])
    assertNotContainActions([cancelOrder, previewQuote])
  })
})

describe('View cancelled order with payment', () => {
  beforeEach(() => {
    cy.visit(urls.omis.order(cancelledOrder.id))
  })

  it('does not show unsupported options', () => {
    assertNotContainActions([cancelOrder, completeOrder, previewQuote])
  })

  it('allows user to view the payment receipt', () => {
    cy.get(viewPayment.link).click()

    cy.url().should('contain', urls.omis.paymentReceipt(cancelledOrder.id))
  })

  it('allows user to view the quote', () => {
    cy.get(viewQuote.link).click()

    cy.url().should('contain', urls.omis.quote(cancelledOrder.id))
  })
})
