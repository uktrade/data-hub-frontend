import urls from '../../../../../src/lib/urls'

describe('Dashboard', () => {
  context('When the help centre API is available', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/help-centre/feed', {
        body: [
          {
            heading: 'Using Sectors in the Find Exporters Tool',
            link: 'https://test-url',
            date: 'a day ago',
          },
          {
            heading: 'Adding more activity to company pages',
            link: 'https://test-url2',
            date: '2 hours ago',
          },
        ],
      }).as('apiRequest')
      cy.visit('/')
      cy.get('[data-test="data-hub-feed"]')
        .as('dataHubFeed')
        .within(() => {
          cy.get('[data-test="data-hub-feed-view-all"]').as('infoFeedTopLink')
        })
    })

    it('should display the correct heading', () => {
      cy.get('@dataHubFeed').find('h3').should('have.text', "What's new?")
    })

    it('should display the info feed list', () => {
      cy.get('@dataHubFeed')
        .find('[data-test="data-hub-feed-link-0"]')
        .should(
          'have.text',
          'Using Sectors in the Find Exporters Tool (opens in new tab)'
        )
        .should('have.attr', 'href', 'https://test-url')

      cy.get('@dataHubFeed')
        .find('[data-test=data-hub-feed-date-0]')
        .contains('a day ago')

      cy.get('@dataHubFeed')
        .find('[data-test="data-hub-feed-link-1"]')
        .should('not.exist')
    })

    it('should display the view all link', () => {
      cy.get('@infoFeedTopLink')
        .should('exist')
        .should('have.text', 'View all Data Hub updates (opens in new tab)')
        .should('have.attr', 'href', urls.external.helpCentre.allUpdates)
    })
  })

  context('When the help centre API returns no results', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/help-centre/feed', {
        body: [],
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
      cy.get('[data-test="data-hub-feed"]').as('dataHubFeed')
    })

    it('should return an empty info feed', () => {
      cy.get('[data-test="data-hub-feed-link-0"]').should('not.exist')
      cy.get('@dataHubFeed')
        .find('p')
        .should('have.text', 'No updates available')
    })
  })

  context('Tabs - Export', () => {
    before(() => {
      cy.visit('/')
    })

    after(() => {
      cy.resetUser()
    })

    it('should display tabs in the right order', () => {
      cy.get('[data-test="dashboard-tabs"]')
        .should('exist')
        .find('[data-test="tablist"]')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 5)
        .first()
        .should('have.text', 'Tasks')
        .next()
        .should('have.text', 'Company lists')
        .next()
        .should('have.text', 'Investment projects')
        .next()
        .should('have.text', 'Export projects')
        .next()
        .should('have.text', 'Referrals')
    })
  })

  context('When My Tasks returns no results', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v4/search/task', {
        body: { count: false },
      }).as('myTaskCount')
      cy.visit('/')
    })

    after(() => {
      cy.resetUser()
    })

    it('should display tabs in the right order', () => {
      cy.get('[data-test="dashboard-tabs"]')
        .should('exist')
        .find('[data-test="tablist"]')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 5)
        .first()
        .should('have.text', 'Tasks')
        .next()
        .should('have.text', 'Company lists')
        .next()
        .should('have.text', 'Investment projects')
        .next()
        .should('have.text', 'Export projects')
        .next()
        .should('have.text', 'Referrals')
    })
  })
})
