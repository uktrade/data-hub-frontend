const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Contact interactions', () => {
  context(
    'when viewing a contact with data on Activity Stream with the feature flag enabled',
    () => {
      before(() => {
        const contactId = fixtures.contact.deanCox.id
        cy.setUserFeatures(['user-contact-activities'])
        cy.visit(urls.contacts.contactInteractions(contactId))
      })

      it('should display the ActivityStream activities', () => {
        cy.get('[data-test=aventri]').should('be.visible')
      })

      after(() => {
        cy.resetUser()
      })
    }
  )
  context('when viewing a contact with the feature flag disabled', () => {
    before(() => {
      const contactId = fixtures.contact.deanCox.id
      cy.visit(urls.contacts.contactInteractions(contactId))
    })

    it('should not render the ActivityStream activities', () => {
      cy.get('#contact-interactions-app').should('not.exist')
    })

    it('should only display Data Hub interactions', () => {
      cy.get('[data-test=item-interaction-0]').should('exist')
    })
  })
})
