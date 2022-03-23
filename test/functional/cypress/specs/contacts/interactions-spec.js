const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Contact interactions', () => {
  context('when viewing a contact with data on Activity Stream', () => {
    before(() => {
      const contactId = fixtures.contact.deanCox.id
      cy.setUserFeatures(['aventri-activities-contacts'])

      cy.visit(urls.contacts.contactInteractions(contactId))
    })

    it('should display the Interactions', () => {
      cy.get('[data-test=aventri]').should('be.visible')
    })
  })
})
