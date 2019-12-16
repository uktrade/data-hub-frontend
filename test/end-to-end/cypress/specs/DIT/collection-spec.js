const selectors = require('../../../../selectors')
const { assertCollection } = require('../../support/assertions')

const { companies, contacts, investments } = require('../../../../../src/lib/urls')

const checkCollection = () => {
  assertCollection(selectors.collection.headerCount, selectors.collection.items)
}

describe('Collection', () => {
  describe('contact', () => {
    before(() => {
      cy.visit(companies.orders('0fb3379c-341c-4da4-b825-bf8d47b26baa'))
    })

    it('should return the results summary for orders collection', () => {
      checkCollection()
    })
  })

  describe('contact interaction', () => {
    before(() => {
      cy.visit(contacts.contactInteractions('952232d2-1d25-4c3a-bcac-2f3a30a94da9'))
    })

    it('should return the results summary for contact interaction collection', () => {
      checkCollection()
    })
  })

  describe('investment interaction', () => {
    before(() => {
      cy.visit(investments.projects.interactionCollection('721e2a04-21c3-4172-a321-4368463a4b2d'))
    })

    it('should return the results summary for investment interaction collection', () => {
      checkCollection()
    })
  })

  describe('investment proposition', () => {
    before(() => {
      cy.visit(investments.projects.propositions('721e2a04-21c3-4172-a321-4368463a4b2d'))
    })

    it('should return the results summary for investment proposition collection', () => {
      checkCollection()
    })
  })
})
