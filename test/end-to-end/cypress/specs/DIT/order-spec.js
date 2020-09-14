const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { omis } = require('../../../../../src/lib/urls')

const today = Cypress.moment().format('D MMM YYYY')

describe('Order', () => {
  beforeEach(() => {
    cy.visit(omis.create(fixtures.company.venusLtd.id))
  })

  it('should create an order and view collection page', () => {
    cy.contains('Continue').click()
    cy.get(selectors.omisCreate.contact).select('Johnny Cakeman')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.country).select('Brazil')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.sectorNo).click()
    cy.get(selectors.omisCreate.sector).select('Aerospace')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.summary)
      .contains('Contact')
      .parent()
      .should('contain', 'Johnny Cakeman')
      .and('contain', 'johnny@cakeman.com')
    cy.get(selectors.omisSummary.header)
      .should('contain', 'Venus Ltd')
      .and('contain', 'Brazil')
      .and('contain', today)

    cy.contains('Orders (OMIS)').click()

    cy.get(selectors.entityCollection.entityBadge(1)).should(
      'contain',
      'Brazil'
    )
    cy.get(selectors.collection.items)
      .should('contain', 'Venus Ltd')
      .and('contain', 'Johnny Cakeman')
      .and('contain', 'North West')
      .and('contain', 'Aerospace')
  })
})
