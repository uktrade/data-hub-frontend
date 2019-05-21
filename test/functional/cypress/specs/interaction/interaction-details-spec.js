const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Interaction details', () => {
  describe('Service Delivery', () => {
    before(() => {
      cy.visit(`/interactions/${fixtures.interaction.interactionWithLink.id}`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Interactions')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/interactions')
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Service delivery')
    })

    it('should display appropriate message when there is a link to a document', () => {
      cy.get(selectors.nav.localNav).should('not.be.visible')
      cy.get(selectors.interactionDetails.serviceDelivery.documents).should(
        'contain', 'View files and documents (will open another website)')
    })
  })

  describe('Interaction', () => {
    before(() => {
      cy.visit(`/interactions/${fixtures.interaction.interactionWithNoLink.id}`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Interactions')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/interactions')
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Interaction')
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
