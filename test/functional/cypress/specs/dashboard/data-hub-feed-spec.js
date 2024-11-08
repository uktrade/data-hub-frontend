describe('Dashboard - Data Hub feed', () => {
  after(() => {
    cy.resetUser()
  })

  context('No updates', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/help-centre/feed', {
        body: [],
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
      cy.get('[data-test="data-hub-feed"]').as('dataHubFeed')
    })

    it('Should contain a header and no updates available text', () => {
      cy.get('@dataHubFeed').find('h3').should('have.text', "What's new?")

      cy.get('@dataHubFeed')
        .find('p')
        .should('have.text', 'No updates available')
    })
  })

  context('Has updates', () => {
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
      cy.wait('@apiRequest')
      cy.get('[data-test="data-hub-feed"]').as('dataHubFeed')
      cy.get('[data-testid="feed-banner"]').as('feedBanner')
    })

    it('should display only one feed item', () => {
      cy.get('@dataHubFeed').find('h3').should('have.text', "What's new?")

      cy.get('@dataHubFeed')
        .find('[data-test="data-hub-feed-link-0"]')
        .should(
          'have.text',
          'Using Sectors in the Find Exporters Tool (opens in new tab)'
        )
        .should('have.attr', 'href', 'https://test-url')

      cy.get('@dataHubFeed')
        .find('[data-test="data-hub-feed-date-0"]')
        .should('have.text', 'a day ago')

      cy.get('@dataHubFeed')
        .find('[data-test="data-hub-feed-link-1"]')
        .should('not.exist')
    })

    it('should display feed banner', () => {
      cy.get('@feedBanner')
        .find('a')
        .should('contain', 'Using Sectors in the Find Exporters Tool')
        .and('have.attr', 'href', 'https://test-url')

      cy.get('@feedBanner').find('button').click()
      cy.get('@feedBanner')
        .should('not.exist')
        .then(() => {
          cy.wrap(localStorage.getItem('announcement-link')).should(
            'contain',
            'https://test-url'
          )
        })
    })
  })

  context('Has updates with localstorage banner present', () => {
    beforeEach(() => {
      localStorage.setItem('announcement-link', 'https://test-url')
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
      cy.wait('@apiRequest')
    })

    it('should not display feed banner if localstorage is set', () => {
      cy.get('[data-testid="feed-banner"]').should('not.exist')
    })
  })
})
