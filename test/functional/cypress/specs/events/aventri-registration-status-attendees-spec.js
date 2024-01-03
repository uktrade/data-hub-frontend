const urls = require('../../../../../src/lib/urls')
const {
  assertErrorDialog,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Aventri status event registration attendees', () => {
  const existingEventId = '2222'
  const errorId = '500'
  const dataHubContactId = '26f61090-df61-446c-b846-60c8bbca522f'

  var registrationStatusTests = [
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
  ]

  registrationStatusTests.forEach(function (test) {
    context(
      `With normal behaviour for registration status ${test.status}`,
      () => {
        before(() => {
          cy.visit(
            urls.events.aventri.registrationStatus(existingEventId, test.status)
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

        context('when sorting for attendees', () => {
          beforeEach(() => {
            cy.intercept(
              'GET',
              `${urls.events.aventri.registrationStatusData(
                existingEventId
              )}?sortBy=first_name:asc&page=1&size=20&registrationStatus*`
            ).as('firstNameA-Z')
            cy.intercept(
              'GET',
              `${urls.events.aventri.registrationStatusData(
                existingEventId
              )}?sortBy=first_name:desc&page=1&size=20&registrationStatus*`
            ).as('firstNameZ-A')
            cy.intercept(
              'GET',
              `${urls.events.aventri.registrationStatusData(
                existingEventId
              )}?sortBy=last_name:asc&page=1&size=20&registrationStatus*`
            ).as('lastNameA-Z')
            cy.intercept(
              'GET',
              `${urls.events.aventri.registrationStatusData(
                existingEventId
              )}?sortBy=last_name:desc&page=1&size=20&registrationStatus*`
            ).as('lastNameZ-A')
            cy.intercept(
              'GET',
              `${urls.events.aventri.registrationStatusData(
                existingEventId
              )}?sortBy=company_name:asc&page=1&size=20&registrationStatus*`
            ).as('companyNameA-Z')
            cy.intercept(
              'GET',
              `${urls.events.aventri.registrationStatusData(
                existingEventId
              )}?sortBy=company_name:desc&page=1&size=20&registrationStatus*`
            ).as('companyNameZ-A')

            cy.visit(
              urls.events.aventri.registrationStatus(
                existingEventId,
                test.status
              )
            )
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
          before(() => {
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
          before(() => {
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
