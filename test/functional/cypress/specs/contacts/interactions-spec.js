const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

const { assertErrorDialog } = require('../../support/assertions')

describe('Contact interactions', () => {
  const contactId = fixtures.contact.deanCox.id

  context('when the feature flag user-contact-activities is enabled', () => {
    before(() => {
      cy.setUserFeatures(['user-contact-activities'])
    })

    context('when viewing a contact with activities', () => {
      before(() => {
        cy.visit(urls.contacts.contactInteractions(contactId))
      })

      it('should display the Activity Stream activities', () => {
        cy.get('[data-test=aventri-activity]').should('be.visible')
      })
    })

    context(
      'viewing a contact when there is an error loading activities',
      () => {
        before(() => {
          cy.intercept('GET', urls.contacts.activity.data(contactId), {
            statusCode: 500,
          })
          cy.visit(urls.contacts.contactInteractions(contactId))
        })

        it('should render an error message', () => {
          assertErrorDialog(
            'TASK_GET_CONTACT_INTERACTIONS',
            'Unable to load Contact Interactions.'
          )
        })
      }
    )

    after(() => {
      cy.resetUser()
    })
  })
  context('when viewing a contact with the feature flag disabled', () => {
    before(() => {
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
