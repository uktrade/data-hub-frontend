const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const dataHubActivities = require('../../../../sandbox/fixtures/v4/activity-feed/data-hub-activities.json')
const { assertErrorDialog } = require('../../support/assertions')

describe('Contact activity', () => {
  const contactId = fixtures.contact.deanCox.id

  context('when the feature flag user-contact-activities is enabled', () => {
    before(() => {
      cy.setUserFeatures(['user-contact-activities'])
    })

    context('when viewing a contact with no activity', () => {
      before(() => {
        cy.intercept(
          'GET',
          `${urls.contacts.activity.data(contactId)}?page=1`,
          {
            body: { activities: [] },
          }
        )
        cy.visit(urls.contacts.contactActivities(contactId))
      })

      it('should display 0 activities', () => {
        cy.get('#contact-activity').contains('0 activities')
      })

      it('should not display the page counter', () => {
        cy.get('[data-test=pagination-summary]').should('not.exist')
      })
    })

    context('when viewing a contact with activities', () => {
      before(() => {
        cy.visit(urls.contacts.contactActivities(contactId))
      })

      it('should display the Activity Stream activities', () => {
        cy.get('[data-test=aventri-activity]').should('be.visible')
      })

      it('should display the total number of activites', () => {
        cy.get('#contact-activity').contains('1,233 activities')
      })

      it('should display the expected number of pages', () => {
        cy.get('[data-test=pagination-summary]').contains('Page 1 of 124')
        cy.get('[data-test=pagination]').should(
          'have.attr',
          'data-total-pages',
          124
        )
      })

      context('when viewing a Data Hub interaction', () => {
        it('should display interaction activity kind label', () => {
          cy.get('[data-test=interaction-activity-kind-label]').contains(
            'interaction'
          )
        })

        it('should display interaction activity theme label', () => {
          cy.get('[data-test=interaction-activity-theme-label]').contains(
            'export'
          )
        })

        it('should display the subject', () => {
          cy.get('[data-test=interaction-activity]').contains(
            'Meeting between Brendan Smith and Tyson Morar'
          )
        })

        it('should display the notes', () => {
          cy.get('[data-test=interaction-activity]').contains(
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has ..."
          )
        })

        it('should display the date', () => {
          cy.get('[data-test=interaction-activity]').contains(
            'Date: 10 Jun 2019'
          )
        })

        it('should display the communication channel', () => {
          cy.get('[data-test=interaction-activity]').contains(
            'Communication channel:'
          )
        })

        it('should display the advisers with email', () => {
          cy.get('[data-test=interaction-activity]')
            .contains(
              'Adviser(s): Brendan Smith Brendan.Smith@trade.gov.uk, Digital Data Hub - Live Service'
            )
            .contains('a', 'Brendan.Smith@trade.gov.uk')
            .should('have.attr', 'href', 'mailto:Brendan.Smith@trade.gov.uk')
        })

        it('should display the service', () => {
          cy.get('[data-test=interaction-activity]').contains(
            'Service: Making Export Introductions : Someone else in DIT'
          )
        })
      })

      context('when there are more than 10 activities', () => {
        it('should be possible to page through', () => {
          cy.get('[data-page-number="2"]').click()
          cy.get('#contact-activity').contains(
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
          cy.visit(urls.contacts.contactActivities(contactId))
        })

        it('should render an error message', () => {
          assertErrorDialog(
            'TASK_GET_CONTACT_ACTIVITIES',
            'Unable to load contact activity.'
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
      cy.visit(urls.contacts.contactActivities(contactId))
    })

    it('should not render the ActivityStream activities', () => {
      cy.get('#contact-activity').should('not.exist')
    })

    it('should only display Data Hub interactions', () => {
      cy.get('[data-test=item-interaction-0]').should('exist')
    })
  })
})
