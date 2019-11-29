const selectors = require('../../../../selectors')
const { assertCollection } = require('../../support/assertions')

const checkCollection = () => {
  assertCollection(selectors.collection.headerCount, selectors.collection.items)
}

describe('Collection', () => {
  describe('contact', () => {
    before(() => {
      cy.visit('/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa/orders')
    })

    it('should return the results summary for orders collection', () => {
      checkCollection()
    })
  })

  describe('contact interaction', () => {
    before(() => {
      cy.visit('/contacts/952232d2-1d25-4c3a-bcac-2f3a30a94da9/interactions')
    })

    it('should return the results summary for contact interaction collection', () => {
      checkCollection()
    })
  })
})
