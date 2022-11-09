import { assertBreadcrumbs } from '../../support/assertions'
import {
  propositionFaker,
  propositionListFaker,
} from '../../fakers/propositions'
import { userFaker } from '../../fakers/users'
import urls from '../../../../../src/lib/urls'

const propositionsEndpoint = '/api-proxy/v4/proposition'
const whoAmIEndpoint = '/api-proxy/whoami/'

describe('Outstanding Proposition Reminders', () => {
  const user = userFaker()
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
        pathname: whoAmIEndpoint,
      },
      {
        body: user,
      }
    ).as('whoAmIApiRequest')
    cy.intercept(
      {
        method: 'GET',
        pathname: propositionsEndpoint,
        query: {
          adviser_id: user.id,
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
          adviser_id: user.id,
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
    cy.wait('@whoAmIApiRequest')
    cy.wait('@propositionAPIRequest')
  }

  context('Reminders List', () => {
    before(() => {
      interceptApiCalls()
      cy.visit(urls.reminders.investments.outstandingPropositions())
      waitForAPICalls()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        'Reminders for outstanding propositions': null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'have.text',
        'Reminders for outstanding propositions'
      )
    })

    it('should include a list of links to other reminders', () => {
      cy.get('[data-test="link-list-item"]')
        .should('have.length', 4)
        .as('listItems')
      cy.get('@listItems')
        .eq(0)
        .find('a')
        .should('contain', 'Reminders for approaching estimated land dates')
        .should(
          'have.attr',
          'href',
          urls.reminders.investments.estimatedLandDate()
        )

      cy.get('@listItems')
        .eq(1)
        .find('a')
        .should('contain', 'Reminders for projects with no recent interaction')
        .should(
          'have.attr',
          'href',
          urls.reminders.investments.noRecentInteraction()
        )

      cy.get('@listItems')
        .eq(2)
        .find('a')
        .should('contain', 'Reminders for outstanding propositions')
        .should(
          'have.attr',
          'href',
          urls.reminders.investments.outstandingPropositions()
        )

      cy.get('@listItems')
        .eq(3)
        .find('a')
        .should('contain', 'Reminders for companies with no recent interaction')
        .should(
          'have.attr',
          'href',
          urls.reminders.exports.noRecentInteractions()
        )
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
        { method: 'GET', pathname: whoAmIEndpoint },
        { body: user }
      ).as('whoAmIApiRequest')
      cy.intercept(
        {
          method: 'GET',
          pathname: propositionsEndpoint,
          query: {
            adviser_id: user.id,
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
      cy.wait('@whoAmIApiRequest')
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
      cy.get('@paginationItems').eq(2).should('have.text', 'Next')
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
