import { assertBreadcrumbs } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'
import {
  exportReminderFaker,
  nestedAdviserFaker,
  nestedInteractionFaker,
  reminderListFaker,
} from '../../fakers/reminders'
import {
  formatDate,
  DATE_FORMAT_MEDIUM,
} from '../../../../../src/client/utils/date-utils'

const remindersEndpoint = '/api-proxy/v4/reminder/no-recent-export-interaction'

describe('Exports no recent Interaction Reminders', () => {
  after(() => {
    cy.resetUser()
  })

  const reminders = [
    exportReminderFaker({
      created_on: '2022-01-01T10:00:00.000000Z',
      last_interaction_date: '2022-11-01T10:00:00.000000Z',
    }),
    ...reminderListFaker(9, exportReminderFaker),
  ]

  const totalCount = 25
  const nextReminder = exportReminderFaker()

  const interceptApiCalls = () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: remindersEndpoint,
        query: { limit: '10', offset: '0', sortby: '-created_on' },
      },
      {
        body: {
          count: totalCount,
          results: reminders,
          next: null,
        },
      }
    ).as('remindersApiRequest')
    cy.intercept(
      {
        method: 'GET',
        pathname: remindersEndpoint,
        query: { limit: '10', offset: '20', sortby: '-created_on' },
      },
      {
        body: {
          count: totalCount,
          results: reminderListFaker(5, exportReminderFaker),
          next: null,
          previous: null,
        },
      }
    ).as('remindersApiRequestPage3')
    cy.intercept(
      {
        method: 'DELETE',
        pathname: `${remindersEndpoint}/${reminders[4].id}`,
      },
      { statusCode: 204 }
    ).as('deleteReminder5ApiRequest')
    cy.intercept(
      {
        method: 'GET',
        pathname: remindersEndpoint,
        query: { limit: '1', offset: '9', sortby: '-created_on' },
      },
      {
        body: {
          count: totalCount - 1,
          results: [nextReminder],
          next: null,
          previous: null,
        },
      }
    ).as('getNextRemindersApiRequest')
  }

  context('Reminders List', () => {
    beforeEach(() => {
      cy.setUserFeatureGroups(['export-notifications'])
      interceptApiCalls()
      cy.visit(urls.reminders.exports.noRecentInteractions())
      cy.wait('@remindersApiRequest')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.index(),
        'Companies with no recent interactions': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Reminders')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Companies with no recent interactions'
      )
    })

    it('should include export menu section', () => {
      cy.get('[data-test="export-menu-group link-list"]').should('exist')
    })

    it('should render the list heading with the total number of reminders', () => {
      cy.get('[data-test="reminder-list-header"').should(
        'contain',
        `${totalCount} reminders`
      )
    })

    it('should include a link to the reminder settings', () => {
      cy.get('[data-test="reminders-settings-link"]')
        .should('contain', 'Reminders settings')
        .should('have.attr', 'href', urls.reminders.settings.index())
    })

    it('should include a list of reminders', () => {
      cy.get('[data-test="reminders-list"]').should('be.visible')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 10)

      cy.get('[data-test="reminders-list-item"]').eq(0).as('reminder')
      cy.get('@reminder')
        .find('[data-test="item-header"]')
        .find('a')
        .should(
          'have.attr',
          'href',
          urls.companies.detail(reminders[0].company.id)
        )
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should(
          'contain',
          `${formatDate(reminders[0].last_interaction_date, DATE_FORMAT_MEDIUM)}`
        )
    })
  })

  context('Reminders without a team', () => {
    before(() => {
      cy.intercept(
        {
          method: 'GET',
          pathname: remindersEndpoint,
          query: { limit: '10', offset: '0', sortby: '-created_on' },
        },
        {
          body: {
            count: 1,
            results: [
              exportReminderFaker({
                created_on: '2022-01-01T10:00:00.000000Z',
                last_interaction_date: '2022-11-01T10:00:00.000000Z',
                interaction: nestedInteractionFaker({
                  created_by: nestedAdviserFaker({ dit_team: null }),
                }),
              }),
            ],
            next: null,
            previous: null,
          },
        }
      ).as('remindersApiRequest')
      cy.visit(urls.reminders.exports.noRecentInteractions())
      cy.wait('@remindersApiRequest')
    })

    it('should state the team is unknown', () => {
      cy.get('[data-test="reminders-list-item"]').eq(0).as('reminder')
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should('contain', 'team unknown')
    })
  })

  context('Reminders without a previous interaction', () => {
    before(() => {
      cy.intercept(
        {
          method: 'GET',
          pathname: remindersEndpoint,
          query: { limit: '10', offset: '0', sortby: '-created_on' },
        },
        {
          body: {
            count: 1,
            results: [
              exportReminderFaker({
                created_on: '2022-01-01T10:00:00.000000Z',
                last_interaction_date: '2022-11-01T10:00:00.000000Z',
                interaction: null,
              }),
            ],
            next: null,
            previous: null,
          },
        }
      ).as('remindersApiRequest')
      cy.visit(urls.reminders.exports.noRecentInteractions())
      cy.wait('@remindersApiRequest')
    })

    it('should have missing interaction copy', () => {
      cy.get('[data-test="reminders-list-item"]').eq(0).as('reminder')
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should('contain', ' no information')
    })
  })

  context('No reminders', () => {
    before(() => {
      cy.intercept(
        {
          method: 'GET',
          pathname: remindersEndpoint,
          query: { limit: '10', offset: '0', sortby: '-created_on' },
        },
        {
          body: {
            count: 0,
            results: [],
            next: null,
            previous: null,
          },
        }
      ).as('remindersApiRequest')
      cy.visit(urls.reminders.exports.noRecentInteractions())
      cy.wait('@remindersApiRequest')
    })

    it('should include a message "You have no reminders"', () => {
      cy.get('[data-test="investments-no-reminders"]').should(
        'contain',
        'You have no reminders.'
      )
    })
  })

  context('Pagination', () => {
    beforeEach(() => {
      interceptApiCalls()
      cy.visit(urls.reminders.exports.noRecentInteractions())
      cy.wait('@remindersApiRequest')
    })

    it('should show pagination controls', () => {
      cy.get('[data-test="pagination"]')
        .should('have.attr', 'data-total-pages', '3')
        .find('li')
        .should('have.length', 4)
        .as('paginationItems')
      cy.get('@paginationItems').eq(0).should('have.text', '1')
      cy.get('@paginationItems').eq(1).should('have.text', '2')
      cy.get('@paginationItems').eq(2).should('have.text', '3')
      cy.get('@paginationItems').eq(3).should('have.text', 'Next page')
    })

    it('should navigate to another page when clicked', () => {
      cy.get('[data-test="pagination"]').find('li').eq(2).click()
      cy.wait('@remindersApiRequestPage3')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 5)
      cy.get('[data-test="page-number-active"]').should(
        'have.attr',
        'data-page-number',
        '3'
      )
    })
  })

  context('Sort', () => {
    beforeEach(() => {
      cy.intercept('GET', `${remindersEndpoint}*`).as('remindersApiRequest')
      cy.visit(urls.reminders.exports.noRecentInteractions())
    })

    it('should apply the default sort', () => {
      cy.wait('@remindersApiRequest').then(({ request }) => {
        expect(request.url).to.contain('sortby=-created_on')
      })
    })

    it('should have all sort options', () => {
      cy.wait('@remindersApiRequest')
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => [o.value, o.text])
        expect(sortOptions).to.deep.eq([
          ['-created_on', 'Most recent'],
          ['created_on', 'Oldest'],
        ])
      })
    })

    it('should sort by "Oldest" and "Most recent"', () => {
      cy.wait('@remindersApiRequest')
      cy.get('[data-test="sortby"] select').select('created_on')
      cy.wait('@remindersApiRequest').then(({ request }) => {
        expect(request.url).to.contain('sortby=created_on')
      })
      cy.get('[data-test="sortby"] select').select('-created_on')
      cy.wait('@remindersApiRequest').then(({ request }) => {
        expect(request.url).to.contain('sortby=-created_on')
      })
    })
  })

  context('Delete', () => {
    beforeEach(() => {
      interceptApiCalls()
      cy.visit(urls.reminders.exports.noRecentInteractions())
      cy.wait('@remindersApiRequest')
    })

    // needed as Cypress appears to cast the JSON date response into a non-ISO format
    const deleted_reminder_date = new Date(reminders[4].created_on)

    it('should delete a reminder when clicked', () => {
      cy.get('[data-test="reminder-list-header"]').should(
        'contain',
        `${totalCount} reminders`
      )
      cy.get('[data-test="reminders-list"]').should('be.visible')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 10)
      cy.get('[data-test="reminders-list-item"]').eq(4).as('reminder')

      cy.get('@reminder').find('[data-test="delete-button"]').eq(1).click()
      cy.wait('@deleteReminder5ApiRequest')
      cy.get('[data-test="reminder-list-header"]').should(
        'contain',
        `${totalCount - 1} reminders`
      )
      cy.get('@reminder')
        .find('[data-test="item-header"]')
        .should('contain', 'Reminder deleted')
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should(
          'contain',
          `Received ${formatDate(
            deleted_reminder_date.toISOString(),
            DATE_FORMAT_MEDIUM
          )} for ${reminders[4].company.name}`
        )
        .find('a')
        .should('not.exist')

      // pulls in the next item and appends to the end of the page
      cy.wait('@getNextRemindersApiRequest')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 11)
      cy.get('[data-test="reminders-list-item"]').eq(10).as('nextReminder')

      cy.get('@nextReminder')
        .find('[data-test="item-content"]')
        .should('contain', nextReminder.interaction.subject)
    })
  })
})
