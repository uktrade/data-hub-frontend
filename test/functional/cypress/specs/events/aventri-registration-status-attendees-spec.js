const urls = require('../../../../../src/lib/urls')
const {
  assertErrorDialog,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Aventri status event registration attendees', () => {
  describe('Sorting', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        '/events/aventri/2222/registration/attendees/data*'
      ).as('apiRequest')
    })
    ;['first_name', 'last_name', 'company_name'].forEach((sortBy) => {
      describe(sortBy, () => {
        it('Descending', () => {
          cy.visit(
            `events/aventri/2222/registration/waiting-list?sortby=${sortBy}%3Adesc`
          )
          cy.wait('@apiRequest').then(({ request }) => {
            expect(request.query.sortBy).to.equal(`${sortBy}:desc`)
          })
        })

        it('Ascending', () => {
          cy.visit(
            `events/aventri/2222/registration/waiting-list?sortby=${sortBy}%3Aasc`
          )
          cy.wait('@apiRequest').then(({ request }) => {
            expect(request.query.sortBy).to.equal(`${sortBy}:asc`)
          })
        })
      })
    })
  })

  describe('Status', () => {
    const existingEventId = '2222'
    const errorId = '500'
    const dataHubContactId = '26f61090-df61-446c-b846-60c8bbca522f'
    ;[
      {
        status: 'did-not-attend',
        expected: {
          total: 22,
          totalLabel: 'Did not attend',
          pageCount: 2,
        },
      },
      {
        status: 'registered',
        expected: {
          total: 44,
          totalLabel: 'Registered',
          pageCount: 3,
        },
      },
      {
        status: 'waiting-list',
        expected: {
          total: 22,
          totalLabel: 'Waiting list',
          pageCount: 2,
        },
      },
      {
        status: 'attended',
        expected: {
          total: 23,
          totalLabel: 'Attended',
          pageCount: 2,
        },
      },
      {
        status: 'cancelled',
        expected: {
          total: 21,
          totalLabel: 'Cancelled',
          pageCount: 2,
        },
      },
    ].forEach(function (test) {
      context(
        `With normal behaviour for registration status ${test.status}`,
        () => {
          beforeEach(() => {
            cy.visit(
              urls.events.aventri.registrationStatus(
                existingEventId,
                test.status
              )
            )
          })
          it('should display aventri event name in breadcrumb', () => {
            assertBreadcrumbs({
              Home: urls.dashboard.index.route,
              Events: urls.events.index(),
              'EITA Test Filtering Event 2022': null,
            })
          })
          it('should display the attendees result count header', () => {
            cy.get('[data-test="attendee-collection-header"]').should(
              'have.text',
              `${test.expected.total} ${test.expected.totalLabel}`
            )
          })
          it('should display the expected number of pages', () => {
            cy.get('[data-test=pagination-summary]').contains(
              `Page 1 of ${test.expected.pageCount}`
            )
          })
          it('should display an attendee', () => {
            cy.get('[data-test="aventri-attendee"]').should('exist')
          })

          context('when you click on the contact name', () => {
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
          })

          context('when there are more than 10 attendees', () => {
            beforeEach(() => {
              cy.visit(
                urls.events.aventri.registrationStatus(
                  existingEventId,
                  test.status
                )
              )
            })
            it('should be possible to page through', () => {
              cy.get('[data-page-number="2"]').click()
              cy.get('[data-test=pagination-summary]').contains(
                `Page 2 of ${test.expected.pageCount}`
              )
              cy.get('[data-test="aventri-attendee"]').should('exist')
            })
          })
          context('With errors', () => {
            beforeEach(() => {
              cy.visit(
                urls.events.aventri.registrationStatus(errorId, test.status)
              )
            })
            it('should render an error message', () => {
              assertErrorDialog(
                'TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES',
                'Error: Unable to load Aventri Registration Status.'
              )
            })
          })
          context('With the feature flag turned off', () => {
            beforeEach(() => {
              cy.visit(
                urls.events.aventri.registrationStatus(
                  existingEventId,
                  test.status
                )
              )
            })
            it('should not display an aventri attendee', () => {
              cy.get('[data-test="aventri-attended"]').should('not.exist')
            })
          })
        }
      )
    })
  })
})
