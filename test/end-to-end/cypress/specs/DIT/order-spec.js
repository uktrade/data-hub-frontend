const selectors = require('../../../../selectors')

const { omis } = require('../../../../../src/lib/urls')

const today = Cypress.moment().format('D MMM YYYY')

describe('Order', () => {
  beforeEach(() => {
    cy.visit(omis.create('0f5216e0-849f-11e6-ae22-56b6b6499611'))
  })

  it('should create an order', () => {
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
  })
})
