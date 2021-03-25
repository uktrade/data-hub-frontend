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
