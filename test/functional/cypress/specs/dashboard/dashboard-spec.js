const EXPORTERS_TOOL_LINK =
  'https://uktrade.zendesk.com/hc/en-gb/articles/360001844497-Using-Sectors-in-the-Find-Exporters-Tool'

describe('Dashboard', () => {
  context('When the help centre API is available', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.get('[data-test="info-feed"]')
        .as('infoFeed')
        .within(() => {
          cy.get('[data-test="info-feed-top-link"]').as('infoFeedTopLink')
          cy.get('[data-test="info-feed-heading"]').as('infoFeedHeading')
          cy.get('[data-test="info-feed-list"]').as('infoFeedList')
        })
    })

    it('should display the top link', () => {
      cy.get('@infoFeedTopLink')
        .should('exist')
        .should('have.text', 'View all updates')
        .should('have.attr', 'href', 'https://lookInVault.com/')
    })

    it('should display the correct heading', () => {
      cy.get('@infoFeedHeading')
        .should('exist')
        .should('have.text', 'Data Hub updates')
    })

    it('should display the info feed list', () => {
      cy.get('@infoFeedList')
        .should('exist')
        .find('[data-test="info-feed-list-item"]')
        .should('have.length', 1)
        .first()
        .within(() => {
          cy.get('a')
            .should('exist')
            .should('have.text', 'Using Sectors in the Find Exporters Tool')
            .should('have.attr', 'href', EXPORTERS_TOOL_LINK)
          cy.get('span')
            .should('exist')
            .should('have.text', '(Link opens in a new window)')
          cy.get('time').should('exist').should('have.text', 'a day ago')
        })
    })
  })

  context('When the help centre API is unavailable', () => {
    beforeEach(() => {
      cy.visit('/', { qs: { test: 'help-centre-unavailable' } })
      cy.get('[data-test="info-feed"]').as('infoFeed')
    })

    it('should return an empty info feed', () => {
      cy.get('[data-test="info-feed-list"]').should('not.exist')
      cy.get('[data-test="info-feed-no-results"]')
        .should('exist')
        .should('have.text', 'No updates available')
    })
  })

  context('When the help centre API returns no results', () => {
    beforeEach(() => {
      cy.visit('/', { qs: { test: 'help-centre-empty' } })
      cy.get('[data-test="info-feed"]').as('infoFeed')
    })

    it('should return an empty info feed', () => {
      cy.get('[data-test="info-feed-list"]').should('not.exist')
      cy.get('[data-test="info-feed-no-results"]')
        .should('exist')
        .should('have.text', 'No updates available')
    })
  })
})
