const fixtures = require('../../fixtures/index')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const { quoteAwaitOrder } = fixtures.omis

describe('Filtered collection list', () => {
  before(() => {
    cy.visit(`${urls.omis.index()}?status=quote_awaiting_acceptance`)
  })

  it('should open order from filtered collection list', () => {
    cy.get(selectors.collection.items).should('contain', 'MNM275/21')
    cy.get(selectors.collection.itemLink).click()

    cy.url().should('contain', urls.omis.order(quoteAwaitOrder.id))
    cy.get('[data-auto-id="localHeader"]').should('contain', 'NM275/21')
  })
})
