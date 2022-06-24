const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const dataHubActivities = require('../../../../sandbox/fixtures/v4/activity-feed/data-hub-activities.json')
const errorContact = require('../../../../sandbox/fixtures/v3/contact/contact-by-id-uk.json')
const { assertErrorDialog } = require('../../support/assertions')
const {
  CONTACT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')

describe('Contact activity', () => {
  const contactId = fixtures.contact.deanCox.id
  const errorContactId = errorContact.id

  context('when the feature flag for activity stream is on', () => {
    before(() => {
      cy.setUserFeatures([CONTACT_ACTIVITY_FEATURE_FLAG])
    })

    context('when viewing a contact with no activity', () => {
      before(() => {
        cy.intercept(
          'GET',
          `${urls.contacts.activity.data(
            contactId
          )}?page=1&selectedSortBy=newest`,
          {
            body: { activities: [] },
          }
        )
        cy.visit(urls.contacts.contactActivities(contactId))
      })

      it('should display 0 activities', () => {
        cy.get('#contact-activity').contains('0 activities')
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

      context('when using the sort by selector', () => {
        beforeEach(() => {
          cy.intercept(
            'GET',
            `${urls.contacts.activity.data(
              contactId
            )}?page=1&selectedSortBy=newest`
          ).as('newestRequest')
          cy.intercept(
            'GET',
            `${urls.contacts.activity.data(
              contactId
            )}?page=1&selectedSortBy=oldest`
          ).as('oldestRequest')
          cy.visit(urls.contacts.contactActivities(contactId))
        })

        after(() => {
          cy.visit(urls.contacts.contactActivities(contactId))
        })

        it('should default to sort by newest', () => {
          cy.wait('@newestRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test=aventri-activity]').contains(
            'EITA Test Event 2022'
          )
        })

        it('should sort by oldest', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('Oldest')
          cy.wait('@oldestRequest').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test="interaction-activity"]').contains(
            'Meeting between Brendan Smith and Tyson Morar'
          )
        })
      })

      context('when viewing a Contact with Data Hub interaction', () => {
        it('should display interaction activity kind label', () => {
          cy.get('[data-test="interaction-activity"]').within(() => {
            cy.get('[data-test=activity-kind-label]').contains('interaction', {
              matchCase: false,
            })
          })
        })

        it('should display interaction activity theme label', () => {
          cy.get('[data-test="interaction-activity"]').within(() => {
            cy.get('[data-test=activity-theme-label]').contains('export', {
              matchCase: false,
            })
          })
        })

        it('should display interaction activity service label', () => {
          cy.get('[data-test="interaction-activity"]').within(() => {
            cy.get('[data-test=activity-service-label]').contains(
              'introduction',
              { matchCase: false }
            )
          })
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

        it('should display the communication channel', () => {
          cy.get('[data-test=interaction-activity]').contains(
            'Communication channel: Email/Website'
          )
        })

        context('when optional data is missing', () => {
          it('should render without missing data', () => {
            cy.get('[data-test=interaction-activity]')
              .eq(1)
              .should('exist')
              .should('not.contain', 'Communication channel: Email/Website')
              .should('not.contain', 'Service: ')
              .should('not.contain', 'Adviser(s): ')
          })
        })
      })

      context('When viewing a Contact with Aventri activities', () => {
        it('should display event date from Aventri', () => {
          cy.get('[data-test="aventri-activity"]').contains(
            'Event date: 02 Mar 2021 to 04 May 2022'
          )
        })
        it('should display the Events label', () => {
          cy.get('[data-test="aventri-activity"]').within(() => {
            cy.get('[data-test="activity-service-label"]').contains('event', {
              matchCase: false,
            })
          })
        })
        it('should display the Kind label', () => {
          cy.get('[data-test="aventri-activity"]').within(() => {
            cy.get('[data-test="activity-kind-label"]').contains(
              'aventri service delivery',
              { matchCase: false }
            )
          })
        })

        context('when virtual event attendance is confirmed', () => {
          it('should display event name and with confirmed virtual event attendance', () => {
            cy.get('[data-test="aventri-activity"]').contains(
              'EITA Test Event 2022: Attended'
            )
          })
        })

        context('when virtual event attendance is unconfirmed', () => {
          it('should display event name with unconfirmed virtual event attendance', () => {
            cy.get('[data-test="aventri-activity"]')
              .contains('EITA Test Event 2 2022')
              .should('not.contain', ': Attended')
          })
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
          cy.visit(urls.contacts.contactActivities(errorContactId))
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
