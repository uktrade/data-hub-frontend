const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors')

describe('Interaction details', () => {
  describe('Service Delivery', () => {
    it('should display appropriate message when there is a link to a document', () => {
      cy.visit(`/interactions/${fixtures.interaction.interactionWithLink.id}`)

      cy.get(selectors.nav.localNav).should('not.be.visible')
      cy.get(selectors.interactionDetails.serviceDelivery.documents).should(
        'contain', 'View files and documents (will open another website)')
    })
  })

  describe('Interaction', () => {
    before(() => {
      cy.visit(`/interactions/${fixtures.interaction.interactionWithNoLink.id}`)
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get(selectors.nav.localNav).should('not.be.visible')
      cy.get(selectors.interactionDetails.interaction.documents).should(
        'contain', 'There are no files or documents')
    })

    it('should have link to investment project', () => {
      cy.get(selectors.interactionDetails.interaction.investmentProject)
        .find('a')
        .should('have.attr', 'href', '/investments/projects/721e2a04-21c3-4172-a321-4368463a4b2d')
    })
  })
})
