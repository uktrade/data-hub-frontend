const {
  EVENT_ACTIVITY_FEATURE_FLAG,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')
const urls = require('../../../../../src/lib/urls')
const {
  assertErrorDialog,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Aventri event attendees', () => {
  const existingEventId = '1111'
  const errorId = '500'
  const dataHubContactId = '26f61090-df61-446c-b846-60c8bbca522f'
  context('With the feature flag turned on', () => {
    before(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
    })
    context('With normal behaviour', () => {
      before(() => {
        cy.visit(urls.events.aventri.attendees(existingEventId))
      })

      it('should display aventri event name in breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.route,
          Events: urls.events.index(),
          'EITA Test Event 2022': null,
        })
      })

      it('should display the attendees result count header', () => {
        cy.get('[data-test="attendee-collection-header"]').should(
          'have.text',
          '32 attendees'
        )
      })

      it('should display the expected number of pages', () => {
        cy.get('[data-test=pagination-summary]').contains('Page 1 of 4')
      })

      it('should display the side nav bar', () => {
        cy.get('[data-test="event-aventri-nav"]').should('exist')
        cy.get('[data-test="event-aventri-details-link"]')
          .should('contain', 'Details')
          .should(
            'have.attr',
            'href',
            urls.events.aventri.details(existingEventId)
          )
        cy.get('[data-test="event-aventri-attendees-link"]')
          .should('contain', 'Attendees')
          .should(
            'have.attr',
            'href',
            urls.events.aventri.attendees(existingEventId)
          )
      })

      it('should display an attendee', () => {
        cy.get('[data-test="aventri-attendee"]').should('exist')
      })

      context('when you click on the contact name', () => {
        beforeEach(() => {
          cy.visit(urls.events.aventri.attendees(existingEventId))
        })
        it("should navigate to the contact's detail page if they exist in Data Hub", () => {
          cy.get('[data-test="aventri-attendee-name"] > a')
            .eq(0)
            .should(
              'have.attr',
              'href',
              urls.contacts.details(dataHubContactId)
            )
        })

        it("should not navigate anywhere if the contact doesn't exist in Data Hub", () => {
          cy.get('[data-test="aventri-attendee-name"]')
            .eq(1)
            .should('not.have.attr', 'href')
        })

        it('should not navigate anywhere if the attendee email address field is an empty string', () => {
          cy.get('[data-test="aventri-attendee-name"]')
            .eq(2)
            .should('not.have.attr', 'href')
        })
      })

      context('when sorting', () => {
        beforeEach(() => {
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=first_name:asc&page=1`
          ).as('firstNameA-Z')
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=first_name:desc&page=1`
          ).as('firstNameZ-A')
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=last_name:asc&page=1`
          ).as('lastNameA-Z')
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=last_name:desc&page=1`
          ).as('lastNameZ-A')
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=company_name:asc&page=1`
          ).as('companyNameA-Z')
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=company_name:desc&page=1`
          ).as('companyNameZ-A')

          cy.visit(urls.events.aventri.attendees(existingEventId))
        })

        it('should sort by "first name: A-Z" by default', () => {
          cy.wait('@firstNameA-Z').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
        })

        it('sorts by "first name: Z-A" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('first_name:desc')
          cy.wait('@firstNameZ-A').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test="aventri-attendee"]')
            .eq(0)
            .should('contain', 'Diana Durrell')
        })

        it('sorts by "last name: A-Z" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('last_name:asc')
          cy.wait('@lastNameA-Z').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test="aventri-attendee"]')
            .eq(0)
            .should('contain', 'Alex Alderman')
        })

        it('sorts by "last name: Z-A" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('last_name:desc')
          cy.wait('@lastNameZ-A').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test="aventri-attendee"]')
            .eq(0)
            .should('contain', 'Diana Durrell')
        })

        it('sorts by "company name: A-Z" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('company_name:asc')
          cy.wait('@companyNameA-Z').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test="aventri-attendee"]')
            .eq(0)
            .should('contain', 'Alex Alderman')
        })

        it('sorts by "company name: Z-A" when selected', () => {
          const element = '[data-test="sortby"] select'
          cy.get(element).select('company_name:desc')
          cy.wait('@companyNameZ-A').then((request) => {
            expect(request.response.statusCode).to.eql(200)
          })
          cy.get('[data-test="aventri-attendee"]')
            .eq(0)
            .should('contain', 'Diana Durrell')
        })
      })

      context('when there are more than 10 attendees', () => {
        beforeEach(() => {
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=first_name:asc&page=1`
          ).as('firstNameA-Z')
          cy.intercept(
            'GET',
            `${urls.events.aventri.attendeesData(
              existingEventId
            )}?sortBy=first_name:desc&page=1`
          ).as('firstNameZ-A')
          cy.visit(urls.events.aventri.attendees(existingEventId))
        })
        it('should be possible to page through', () => {
          cy.get('[data-page-number="2"]').click()
          cy.get('[data-test=pagination-summary]').contains('Page 2 of 4')
          cy.get('[data-test="aventri-attendee"]').should('exist')
        })
      })
    })

    context('With errors', () => {
      before(() => {
        cy.visit(urls.events.aventri.attendees(errorId))
      })

      it('should render an error message', () => {
        assertErrorDialog(
          'TASK_GET_EVENT_AVENTRI_ATTENDEES',
          'Unable to load Aventri Attendees.'
        )
      })
    })

    after(() => {
      cy.resetUser()
    })
  })

  context('With the feature flag turned off', () => {
    before(() => {
      cy.visit(urls.events.aventri.attendees(existingEventId))
    })
    it('should not display an aventri attendee', () => {
      cy.get('[data-test="aventri-attendee"]').should('not.exist')
    })
  })
})
