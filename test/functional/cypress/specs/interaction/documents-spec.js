const selectors = require('../../selectors')

describe('Interaction documents', () => {
  it('should display appropriate message when there is a link to a document', () => {
    cy.visit('/interactions/ec4a46ef-6e50-4a5c-bba0-e311f0471312')

    cy.get(selectors.interactionDetails.serviceDelivery.documents).should(
      'contain', 'View files and documents (will open another website)')
  })

  it('should display appropriate message when there is not a link to a document', () => {
    cy.visit('/interactions/0dcb3748-c097-4f20-b84f-0114bbb1a8e0')

    cy.get(selectors.interactionDetails.interaction.documents).should(
      'contain', 'There are no files or documents')
  })
})
