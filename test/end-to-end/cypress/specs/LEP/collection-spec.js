const selectors = require('../../../../selectors')

describe('ompany Collections', () => {
  before(() => {
    cy.visit(`/companies`)
  })

  it('should return the results summary for a company collection', () => {
    cy.get(selectors.collection.headerCount).invoke('text').then((headerCount) => {
      cy.get(selectors.collection.items).should((collectionItems) => {
        expect(headerCount).to.eq(collectionItems.length.toString())
      })
    })
  })
})
