const fixtures = require('../../fixtures')
const {
  assertCollection,
  assertReactCollection,
} = require('../../support/assertions')

const { companies, investments } = require('../../../../../src/lib/urls')

describe('Collection', () => {
  describe('contact', () => {
    const company = fixtures.company.create.lambda()

    before(() => {
      cy.loadFixture([company])
      cy.visit(companies.orders(company.pk))
    })

    it('should return the results summary for orders collection', () => {
      assertReactCollection()
    })
  })

  describe('investment interaction', () => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()

    before(() => {
      cy.loadFixture([investmentProject])
      cy.visit(investments.projects.interactions.index(investmentProject.pk))
    })

    it('should return the results summary for investment interaction collection', () => {
      assertCollection()
    })
  })

  describe('investment proposition', () => {
    const investmentProject = fixtures.investmentProject.create.newHotelFdi()

    before(() => {
      cy.loadFixture([investmentProject])
      cy.visit(investments.projects.propositions(investmentProject.pk))
    })

    it('should return the results summary for investment proposition collection', () => {
      assertCollection()
    })
  })
})
