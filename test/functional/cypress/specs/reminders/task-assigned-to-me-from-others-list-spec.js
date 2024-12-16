import { assertBreadcrumbs } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'
import { myTasksReminderFaker, reminderListFaker } from '../../fakers/reminders'
import {
  formatDate,
  DATE_FORMAT_FULL,
} from '../../../../../src/client/utils/date-utils'

const remindersEndpoint =
  '/api-proxy/v4/reminder/my-tasks-task-assigned-to-me-from-others'

describe('My Tasks Task Assigned To Me From Others Reminders', () => {
  after(() => {
    cy.resetUser()
  })

  const reminders = [
    myTasksReminderFaker({
      created_on: '2022-01-01T10:00:00.000000Z',
      event: 'Super awesome title',
    }),
    ...reminderListFaker(9, myTasksReminderFaker),
  ]
  const nextReminder = myTasksReminderFaker()
  const totalCount = 25

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
          previous: null,
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
          results: reminderListFaker(5, myTasksReminderFaker),
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
      interceptApiCalls()
      cy.visit(urls.reminders.myTasks.taskAssignedToMeFromOthers())
      cy.wait('@remindersApiRequest')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.index(),
        'Task assigned to me from others': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Reminders')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Task assigned to me from others'
      )
    })

    it('should render the list heading with the total number of reminders', () => {
      cy.get('[data-test="reminder-list-header"]').should(
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
        .should('contain', 'Received 1 Jan 2022')
        .should('contain', 'Super awesome title')
        .find('a')
        .should('have.attr', 'href', urls.tasks.details(reminders[0].task.id))
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should(
          'contain',
          `Company: ${reminders[0].task.investment_project.investor_company.name}`
        )
        .should(
          'contain',
          `Date due: ${formatDate(
            reminders[0].task.due_date,
            DATE_FORMAT_FULL
          )}`
        )
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
      cy.visit(urls.reminders.myTasks.taskAssignedToMeFromOthers())
      cy.wait('@remindersApiRequest')
    })

    it('should include a message "You have no reminders"', () => {
      cy.get('[data-test="my-tasks-no-reminders"]').should(
        'contain',
        'You have no reminders.'
      )
    })
  })

  context('Pagination', () => {
    beforeEach(() => {
      interceptApiCalls()
      cy.visit(urls.reminders.myTasks.taskAssignedToMeFromOthers())
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
      cy.visit(urls.reminders.myTasks.taskAssignedToMeFromOthers())
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
      cy.visit(urls.reminders.myTasks.taskAssignedToMeFromOthers())
      cy.wait('@remindersApiRequest')
    })

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
          `${reminders[4].event} for ${reminders[4].task.company.name}`
        )
        .find('a')
        .should('not.exist')

      // pulls in the next item and appends to the end of the page
      cy.wait('@getNextRemindersApiRequest')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 11)
      cy.get('[data-test="reminders-list-item"]').eq(10).as('nextReminder')

      cy.get('@nextReminder')
        .find('[data-test="item-content"]')
        .should(
          'contain',
          `Date due: ${formatDate(
            nextReminder.task.due_date,
            DATE_FORMAT_FULL
          )}`
        )
        .should('contain', `Company: ${nextReminder.task.company.name}`)
        .find('a')
        .should(
          'have.attr',
          'href',
          urls.companies.detail(nextReminder.task.company.id)
        )
    })
  })
})
