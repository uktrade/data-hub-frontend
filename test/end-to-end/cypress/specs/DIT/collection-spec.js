const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { assertCollection } = require('../../support/assertions')

const {
  companies,
  contacts,
  investments,
} = require('../../../../../src/lib/urls')

const checkCollection = () => {
  assertCollection(selectors.collection.headerCount, selectors.collection.items)
}

describe.skip('Collection', () => {
  describe('contact', () => {
    before(() => {
      cy.visit(companies.orders(fixtures.company.lambdaPlc.id))
    })

    it('should return the results summary for orders collection', () => {
      checkCollection()
    })
  })

  describe('contact interaction', () => {
    before(() => {
      cy.visit(contacts.contactInteractions(fixtures.contact.deanCox.id))
    })

    it('should return the results summary for contact interaction collection', () => {
      checkCollection()
    })
  })

  describe('investment interaction', () => {
    before(() => {
      cy.visit(
        investments.projects.interactions.index(
          fixtures.investmentProject.newHotelFdi.id
        )
      )
    })

    it('should return the results summary for investment interaction collection', () => {
      checkCollection()
    })
  })

  describe('investment proposition', () => {
    before(() => {
      cy.visit(
        investments.projects.propositions(
          fixtures.investmentProject.newHotelFdi.id
        )
      )
    })

    it('should return the results summary for investment proposition collection', () => {
      checkCollection()
    })
  })
})
