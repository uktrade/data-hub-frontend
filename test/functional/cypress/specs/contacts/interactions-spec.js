const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Contact interactions', () => {
  context(
    'when viewing a contact with data on Activity Stream with the feature flag enabled',
    () => {
      before(() => {
        const contactId = fixtures.contact.deanCox.id
        cy.setUserFeatures(['aventri-activities-contacts-user'])
        cy.visit(urls.contacts.contactInteractions(contactId))
      })

      it('should display the Interactions', () => {
        cy.get('[data-test=aventri]').should('be.visible')
      })

      after(() => {
        cy.resetUser()
      })
    }
  )
  context(
    'when viewing a contact with data on Activity Stream with the feature flag disabled',
    () => {
      before(() => {
        const contactId = fixtures.contact.deanCox.id
        cy.visit(urls.contacts.contactInteractions(contactId))
      })

      it('should only display non-Aventri interactions', () => {
        cy.get('[data-test=aventri]').should('not.exist')
      })
    }
  )
})
