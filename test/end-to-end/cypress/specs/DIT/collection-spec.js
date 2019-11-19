const selectors = require('../../../../selectors')
const { assertCollection } = require('../../support/assertions')

describe('Collection', () => {
  describe('contact', () => {
    before(() => {
      cy.visit('/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa/orders')
    })

    it('should return the results summary for orders collection', () => {
      assertCollection(selectors.collection.headerCount, selectors.collection.items)
    })
  })
})
