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

describe('Collection', () => {
  describe('contact', () => {
    const company = fixtures.company.create.lambda()

    before(() => {
      cy.loadFixture([company])
      cy.visit(companies.orders(company.pk))
    })

    it('should return the results summary for orders collection', () => {
      checkCollection()
    })
  })

  describe('contact interaction', () => {
    const company = fixtures.company.create.lambda()
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(contacts.contactInteractions(contact.pk))
    })

    it('should return the results summary for contact interaction collection', () => {
      checkCollection()
    })
  })

  describe('investment interaction', () => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()

    before(() => {
      cy.loadFixture([investmentProject])
      cy.visit(investments.projects.interactions.index(investmentProject.pk))
    })

    it('should return the results summary for investment interaction collection', () => {
      checkCollection()
    })
  })

  describe('investment proposition', () => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()

    before(() => {
      cy.loadFixture([investmentProject])
      cy.visit(investments.projects.propositions(investmentProject.pk))
    })

    it('should return the results summary for investment proposition collection', () => {
      checkCollection()
    })
  })
})
