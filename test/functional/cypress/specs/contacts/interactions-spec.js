const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const dataHubActivities = require('../../../../sandbox/fixtures/v4/activity-feed/data-hub-activities.json')
const { assertErrorDialog } = require('../../support/assertions')

describe('Contact interactions', () => {
  const contactId = fixtures.contact.deanCox.id

  context('when the feature flag user-contact-activities is enabled', () => {
    before(() => {
      cy.setUserFeatures(['user-contact-activities'])
    })

    context('when viewing a contact with no activities', () => {
      before(() => {
        cy.intercept(
          'GET',
          `${urls.contacts.activity.data(contactId)}?page=1`,
          {
            body: { activities: [] },
          }
        )
        cy.visit(urls.contacts.contactInteractions(contactId))
      })

      it('should display 0 activities', () => {
        cy.get('#contact-interactions-app').contains('0 activities')
      })

      it('should not display the page counter', () => {
        cy.get('[data-test=pagination-summary]').should('not.exist')
      })
    })

    context('when viewing a contact with activities', () => {
      before(() => {
        cy.visit(urls.contacts.contactInteractions(contactId))
      })

      it('should display the Activity Stream activities', () => {
        cy.get('[data-test=aventri-activity]').should('be.visible')
      })

      it('should display the total number of activites', () => {
        cy.get('#contact-interactions-app').contains('1,233 activities')
      })

      it('should display the expected number of pages', () => {
        cy.get('[data-test=pagination-summary').contains('Page 1 of 124')
        cy.get('[data-test=pagination').should(
          'have.attr',
          'data-total-pages',
          124
        )
      })

      context('when there are more than 10 activities', () => {
        it('should be possible to page through', () => {
          cy.get('[data-page-number="2"]').click()
          cy.get('#contact-interactions-app').contains(
            `${dataHubActivities.hits.hits[0]._source.object['dit:subject']}`
          )
          cy.get('[data-test=aventri-activity]').should('not.exist')
          cy.get('[data-test=pagination-summary').contains('Page 2 of 124')
        })
      })
    })

    context(
      'viewing a contact when there is an error loading activities',
      () => {
        before(() => {
          cy.intercept(
            'GET',
            `${urls.contacts.activity.data(contactId)}?page=1`,
            {
              statusCode: 500,
            }
          )
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
