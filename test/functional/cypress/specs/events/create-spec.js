const selectors = require('../../../../selectors')

describe('Event create', () => {
  before(() => {
    cy.visit('/events/create')
  })

  it('should toggle uk region field', () => {
    cy.get(selectors.eventCreate.addressCountry).select('United Kingdom')
    cy.get(selectors.eventCreate.ukRegion).should('be.visible')

    cy.get(selectors.eventCreate.addressCountry).select('Uganda')
    cy.get(selectors.eventCreate.ukRegion).should('not.be.visible')
  })

  it('should toggle teams section when interacting with shared options', () => {
    cy.get(selectors.eventCreate.sharedYes).click()
    cy.get(selectors.eventCreate.teams).should('be.visible')

    cy.get(selectors.eventCreate.sharedNo).click()
    cy.get(selectors.eventCreate.teams).should('not.be.visible')
  })

  it('should allow user to add multiple shared teams', () => {
    cy.get(selectors.eventCreate.sharedYes).click()
    cy.get(selectors.eventCreate.teams).eq(0).select('BPI')
    cy.get(selectors.eventCreate.addAnotherSharedTeam).click()
    cy.get(selectors.eventCreate.teams).eq(1).select('BN Americas')

    cy.get(selectors.eventCreate.teams).eq(0).should('contain', 'BPI')
    cy.get(selectors.eventCreate.teams).eq(1).should('contain', 'BN Americas')
  })

  it('should allow user to add multiple programmes', () => {
    cy.get(selectors.eventCreate.sharedYes).click()
    cy.get(selectors.eventCreate.relatedProgrammes).eq(0).select('CEN Energy')
    cy.get(selectors.eventCreate.addAnotherProgramme).click()
    cy.get(selectors.eventCreate.relatedProgrammes).eq(1).select('CEN Services')

    cy.get(selectors.eventCreate.relatedProgrammes)
      .eq(0)
      .should('contain', 'CEN Energy')
    cy.get(selectors.eventCreate.relatedProgrammes)
      .eq(1)
      .should('contain', 'Services')
  })

  it('should allow a user to add multiple related trade agreements', () => {
    cy.get(selectors.eventCreate.tradeAgreementExistsYes).click()
    cy.get(selectors.eventCreate.relatedTradeAgreements).eq(0).select('Japan')
    cy.get(selectors.eventCreate.addAnotherTradeAgreement).click()
    cy.get(selectors.eventCreate.relatedTradeAgreements)
      .eq(1)
      .select('Australia')

    cy.get(selectors.eventCreate.relatedTradeAgreements)
      .eq(0)
      .should('contain', 'Japan')
    cy.get(selectors.eventCreate.relatedTradeAgreements)
      .eq(1)
      .should('contain', 'Australia')
  })
})
