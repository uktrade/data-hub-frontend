const selectors = require('../../selectors')

describe('Service delivery form', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/api/options/adviser?autocomplete*').as('adviserAutocomplete')
    cy.visit('/companies/some-company/interactions/create/service-delivery')
  })

  it('should display all service delivery fields', () => {
    cy.get(selectors.addInteraction.contact).should('be.visible')
    cy.get(selectors.addInteraction.ditAdviserTypeahead.fieldset).should('to.exist')
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

  context('When interacting with service field', () => {
    it('should toggle fields based on service dropdown values', () => {
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

    it('should toggle fields whether there is an event or not', () => {
      cy.get(selectors.addInteraction.eventYes).click()
      cy.get(selectors.addInteraction.event).should('be.visible')

      cy.get(selectors.addInteraction.eventNo).click()
      cy.get(selectors.addInteraction.event).should('not.be.visible')
    })
  })

  context('When interacting with the adviser typeahead', () => {
    it('should contain an pre-populated input with an adviser', () => {
      cy.get(selectors.addInteraction.ditAdviserTypeahead.placeHolder)
        .should('have.attr', 'placeholder')
        .and('include', 'Ade Walton, RTC North : North East R & D Collaboration Project')
    })

    it('should be able to select an adviser', () => {
      cy.get(selectors.addInteraction.ditAdviserTypeahead.textInput).click()
      cy.get(selectors.addInteraction.ditAdviserTypeahead.placeHolder).first().type('test')
      cy.wait('@adviserAutocomplete')
      cy.get(selectors.addInteraction.ditAdviserTypeahead.placeHolder).first().type('{downarrow}')
      cy.get(selectors.addInteraction.ditAdviserTypeahead.placeHolder).first().type('{enter}')

      cy.get(selectors.addInteraction.ditAdviserTypeahead.selectedOption).first()
        .should('contain', 'Barbara Benedicto, British Consulate General Sao Paulo Brazil')
    })

    it('should be able to create and remove a new adviser typeahead input field', () => {
      cy.get(selectors.addInteraction.ditAdviserTypeahead.addAnotherBtn).click()
      cy.get(selectors.addInteraction.ditAdviserTypeahead.secondTypeahead)
        .should('have.attr', 'placeholder')
        .and('include', 'Select option')
      cy.get(selectors.addInteraction.ditAdviserTypeahead.secondTypeaheadRemoveLink).should('be.visible')
      cy.get(selectors.addInteraction.ditAdviserTypeahead.secondTypeaheadRemoveLink).click()
      cy.get(selectors.addInteraction.ditAdviserTypeahead.secondTypeahead).should('not.be.visible')
    })
  })
})
