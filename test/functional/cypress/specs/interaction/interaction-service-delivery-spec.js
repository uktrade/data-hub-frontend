const selectors = require('../../selectors')

describe('Interaction service delivery', () => {
  beforeEach(() => {
    cy.visit('/companies/some-company/interactions/create/service-delivery')
  })

  it('displays all service delivery fields', () => {
    cy.get(selectors.addInteraction.contact).should('be.visible')
    cy.get(selectors.addInteraction.serviceProvider).should('be.visible')
    cy.get(selectors.addInteraction.ditAdviser).should('be.visible')
    cy.get(selectors.addInteraction.eventYes).should('be.visible')
    cy.get(selectors.addInteraction.eventNo).should('be.visible')
    cy.get(selectors.addInteraction.event).should('not.be.visible')
    cy.get(selectors.addInteraction.service).should('be.visible')
    cy.get(selectors.addInteraction.subject).should('be.visible')
    cy.get(selectors.addInteraction.notes).should('be.visible')
    cy.get(selectors.addInteraction.dateOfInteractionYear).should('be.visible')
    cy.get(selectors.addInteraction.dateOfInteractionMonth).should('be.visible')
    cy.get(selectors.addInteraction.dateOfInteractionDay).should('be.visible')

    cy.get(selectors.addInteraction.serviceStatus).should('not.be.visible')
    cy.get(selectors.addInteraction.grantOffered).should('not.be.visible')
    cy.get(selectors.addInteraction.netReceipt).should('not.be.visible')
  })

  it('toggles fields based on service dropdown values', () => {
    cy.get(selectors.addInteraction.service).select('Tradeshow Access Programme (TAP)')
    cy.get(selectors.addInteraction.serviceStatus).should('be.visible')
    cy.get(selectors.addInteraction.grantOffered).should('be.visible')

    cy.get(selectors.addInteraction.serviceStatus).select('Completed')
    cy.get(selectors.addInteraction.netReceipt).should('be.visible')

    cy.get(selectors.addInteraction.serviceStatus).select('Current')
    cy.get(selectors.addInteraction.netReceipt).should('not.be.visible')

    cy.get(selectors.addInteraction.service).select('Bank Referral')
    cy.get(selectors.addInteraction.serviceStatus).should('not.be.visible')
    cy.get(selectors.addInteraction.grantOffered).should('not.be.visible')
  })

  it('toggles fields whether there is an event or not', () => {
    cy.get(selectors.addInteraction.eventYes).click()
    cy.get(selectors.addInteraction.event).should('be.visible')

    cy.get(selectors.addInteraction.eventNo).click()
    cy.get(selectors.addInteraction.event).should('not.be.visible')
  })
})
