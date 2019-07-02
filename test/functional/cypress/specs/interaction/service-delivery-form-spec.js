const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Service delivery form', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/api/options/adviser?autocomplete*').as('adviserAutocomplete')
    cy.visit(`/companies/${fixtures.default.id}/interactions/create/export/service-delivery`)
  })

  it('should render breadcrumbs', () => {
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
    cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
    cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
    cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add service delivery')
  })

  it('should display all service delivery fields', () => {
    cy.get(selectors.interactionForm.contact).should('be.visible')
    cy.get(selectors.interactionForm.ditAdviserTypeahead.fieldset).should('to.exist')
    cy.get(selectors.interactionForm.eventYes).should('be.visible')
    cy.get(selectors.interactionForm.eventNo).should('be.visible')
    cy.get(selectors.interactionForm.event).should('not.be.visible')
    cy.get(selectors.interactionForm.service).should('be.visible')
    cy.get(selectors.interactionForm.subject).should('be.visible')
    cy.get(selectors.interactionForm.notes).should('be.visible')
    cy.get(selectors.interactionForm.dateOfInteractionYear).should('be.visible')
    cy.get(selectors.interactionForm.dateOfInteractionMonth).should('be.visible')
    cy.get(selectors.interactionForm.dateOfInteractionDay).should('be.visible')

    cy.get(selectors.interactionForm.serviceStatus).should('not.be.visible')
    cy.get(selectors.interactionForm.grantOffered).should('not.be.visible')
    cy.get(selectors.interactionForm.netReceipt).should('not.be.visible')
  })

  context('When interacting with service field', () => {
    it('should toggle fields based on service dropdown values', () => {
      cy.get(selectors.interactionForm.service).select('A Specific DIT Export Service or Funding')
      cy.get(selectors.interactionForm.subService).select('Tradeshow Access Programme (TAP)')
      cy.get(selectors.interactionForm.serviceDeliveryStatus).should('be.visible')
      cy.get(selectors.interactionForm.grantOffered).should('be.visible')

      cy.get(selectors.interactionForm.serviceDeliveryStatus).select('Completed')
      cy.get(selectors.interactionForm.netReceipt).should('be.visible')

      cy.get(selectors.interactionForm.serviceDeliveryStatus).select('Current')
      cy.get(selectors.interactionForm.netReceipt).should('not.be.visible')

      cy.get(selectors.interactionForm.service).select('A Specific Service')
      cy.get(selectors.interactionForm.serviceDeliveryStatus).should('not.be.visible')
      cy.get(selectors.interactionForm.grantOffered).should('not.be.visible')
    })

    it('should toggle fields whether there is an event or not', () => {
      cy.get(selectors.interactionForm.eventYes).click()
      cy.get(selectors.interactionForm.event).should('be.visible')

      cy.get(selectors.interactionForm.eventNo).click()
      cy.get(selectors.interactionForm.event).should('not.be.visible')
    })
  })

  context('When interacting with the adviser typeahead', () => {
    it('should contain an pre-populated input with an adviser', () => {
      cy.get(selectors.interactionForm.ditAdviserTypeahead.placeHolder)
        .should('have.attr', 'placeholder')
        .and('include', 'Ade Walton, RTC North : North East R & D Collaboration Project')
    })

    it('should be able to select an adviser', () => {
      cy.get(selectors.interactionForm.ditAdviserTypeahead.textInput).click()
      cy.get(selectors.interactionForm.ditAdviserTypeahead.placeHolder).first().type('test')
      cy.wait('@adviserAutocomplete')
      cy.get(selectors.interactionForm.ditAdviserTypeahead.placeHolder).first().type('{downarrow}')
      cy.get(selectors.interactionForm.ditAdviserTypeahead.placeHolder).first().type('{enter}')

      cy.get(selectors.interactionForm.ditAdviserTypeahead.selectedOption).first()
        .should('contain', 'Barbara Benedicto, British Consulate General Sao Paulo Brazil')
    })

    it('should be able to create and remove a new adviser typeahead input field', () => {
      cy.get(selectors.interactionForm.ditAdviserTypeahead.addAnotherBtn).click()
      cy.get(selectors.interactionForm.ditAdviserTypeahead.secondTypeahead)
        .should('have.attr', 'placeholder')
        .and('include', 'Search team member')
      cy.get(selectors.interactionForm.ditAdviserTypeahead.secondTypeaheadRemoveLink).should('be.visible')
      cy.get(selectors.interactionForm.ditAdviserTypeahead.secondTypeaheadRemoveLink).click()
      cy.get(selectors.interactionForm.ditAdviserTypeahead.secondTypeahead).should('not.be.visible')
    })
  })
})
