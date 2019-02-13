import selectors from '../../selectors'

describe('Interaction service delivery', () => {
  beforeEach(() => {
    cy.visit('/companies/some-company/interactions/create/service-delivery')
  })

  it('displays all service delivery fields', () => {
    cy.get(selectors.interactions.contact).should('be.visible')
    cy.get(selectors.interactions.serviceProvider).should('be.visible')
    cy.get(selectors.interactions.ditAdviser).should('be.visible')
    cy.get(selectors.interactions.eventYes).should('be.visible')
    cy.get(selectors.interactions.eventNo).should('be.visible')
    cy.get(selectors.interactions.event).should('not.be.visible')
    cy.get(selectors.interactions.service).should('be.visible')
    cy.get(selectors.interactions.subject).should('be.visible')
    cy.get(selectors.interactions.notes).should('be.visible')
    cy.get(selectors.interactions.dateOfInteractionYear).should('be.visible')
    cy.get(selectors.interactions.dateOfInteractionMonth).should('be.visible')
    cy.get(selectors.interactions.dateOfInteractionDay).should('be.visible')

    cy.get(selectors.interactions.serviceStatus).should('not.be.visible')
    cy.get(selectors.interactions.grantOffered).should('not.be.visible')
    cy.get(selectors.interactions.netReceipt).should('not.be.visible')
  })

  it('toggles fields based on service dropdown values', () => {
    cy.get(selectors.interactions.service).select('Tradeshow Access Programme (TAP)')
    cy.get(selectors.interactions.serviceStatus).should('be.visible')
    cy.get(selectors.interactions.grantOffered).should('be.visible')

    cy.get(selectors.interactions.serviceStatus).select('Completed')
    cy.get(selectors.interactions.netReceipt).should('be.visible')

    cy.get(selectors.interactions.serviceStatus).select('Current')
    cy.get(selectors.interactions.netReceipt).should('not.be.visible')

    cy.get(selectors.interactions.service).select('Bank Referral')
    cy.get(selectors.interactions.serviceStatus).should('not.be.visible')
    cy.get(selectors.interactions.grantOffered).should('not.be.visible')
  })
})
