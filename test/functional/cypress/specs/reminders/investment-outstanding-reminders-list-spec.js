import { assertBreadcrumbs } from '../../support/assertions'
import {
  propositionFaker,
  propositionListFaker,
} from '../../fakers/propositions'
import urls from '../../../../../src/lib/urls'

const propositionsEndpoint = '/api-proxy/v4/proposition'

// Whoami adviser id
const adviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'

describe('Outstanding Proposition Reminders', () => {
  after(() => {
    cy.resetUser()
  })

  const totalCount = 11
  const propositions = [
    propositionFaker({
      deadline: '2022-01-25T10:00:00.000000Z',
    }),
    ...propositionListFaker(9),
  ]

  const interceptApiCalls = () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: propositionsEndpoint,
        query: {
          adviser_id: adviserId,
          status: 'ongoing',
          sortby: 'deadline',
          offset: '0',
          limit: '10',
        },
      },
      {
        body: {
          count: totalCount,
          results: propositions,
          next: null,
          previous: null,
        },
      }
    ).as('propositionAPIRequest')
    cy.intercept(
      {
        method: 'GET',
        pathname: propositionsEndpoint,
        query: {
          adviser_id: adviserId,
          status: 'ongoing',
          sortby: 'deadline',
          offset: '10',
          limit: '10',
        },
      },
      {
        body: {
          count: totalCount,
          results: [propositionFaker()],
          next: null,
          previous: null,
        },
      }
    ).as('propositionAPIRequestPage2')
  }

  const waitForAPICalls = () => {
    cy.wait('@propositionAPIRequest')
  }

  context('Reminders List', () => {
    beforeEach(() => {
      cy.setUserFeatureGroups(['investment-notifications'])
      interceptApiCalls()
      cy.visit(urls.reminders.investments.outstandingPropositions())
      waitForAPICalls()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.index(),
        'Outstanding propositions': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Reminders')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Outstanding propositions'
      )
    })

    it('should include investment menu section', () => {
      cy.get('[data-test="investment-menu-group link-list"]').should('exist')
    })

    it('should render the list heading with the total number of reminders', () => {
      cy.get('[data-test="reminder-list-header"]').should(
        'contain',
        `${totalCount} reminders`
      )
    })

    it('should render the pagination summary', () => {
      cy.get('[data-test="pagination-summary"]').should(
        'contain',
        'Page 1 of 2'
      )
    })

    it('should not include a link to the reminder settings', () => {
      cy.get('[data-test="reminders-settings-link"]').should('not.exist')
    })

    it('should include a list of reminders', () => {
      cy.get('[data-test="reminders-list"]').should('be.visible')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 10)

      cy.get('[data-test="reminders-list-item"]').eq(0).as('reminder')
      cy.get('@reminder')
        .find('[data-test="item-header"]')
        .should('contain', 'Due Tue, 25 Jan 2022')
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should('contain', `${propositions[0].name}`)
        .find('a')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.propositions(
            propositions[0].investment_project.id
          )
        )
        .should('contain', propositions[0].name)
      cy.get('@reminder')
        .find('[data-test="item-footer"]')
        .should(
          'contain',
          `Project code ${propositions[0].investment_project.project_code}`
        )
    })
  })

  context('No reminders', () => {
    before(() => {
      cy.intercept(
        {
          method: 'GET',
          pathname: propositionsEndpoint,
          query: {
            adviser_id: adviserId,
            status: 'ongoing',
            sortby: 'deadline',
            offset: '0',
            limit: '10',
          },
        },
        {
          body: {
            count: 0,
            results: [],
            next: null,
            previous: null,
          },
        }
      ).as('noPropositionsAPIRequest')
      cy.visit(urls.reminders.investments.outstandingPropositions())
      cy.wait('@noPropositionsAPIRequest')
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
      cy.visit(urls.reminders.investments.outstandingPropositions())
      waitForAPICalls()
    })

    it('should show pagination controls', () => {
      cy.get('[data-test="pagination"]')
        .should('have.attr', 'data-total-pages', '2')
        .find('li')
        .should('have.length', 3)
        .as('paginationItems')
      cy.get('@paginationItems').eq(0).should('have.text', '1')
      cy.get('@paginationItems').eq(1).should('have.text', '2')
      cy.get('@paginationItems').eq(2).should('have.text', 'Next page')
    })

    it('should navigate to another page when clicked', () => {
      cy.get('[data-test="pagination"]').find('li').eq(2).click()
      cy.wait('@propositionAPIRequestPage2')
      cy.get('[data-test="pagination-summary"]').should(
        'contain',
        'Page 2 of 2'
      )
      cy.get('[data-test="reminders-list-item"]').should('have.length', 1)
      cy.get('[data-test="page-number-active"]').should(
        'have.attr',
        'data-page-number',
        '2'
      )
    })
  })
})
