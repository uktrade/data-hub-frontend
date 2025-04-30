const urls = require('../../../../../src/lib/urls')

describe('Dashboard - no investment projects', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: 0,
        results: [],
      },
    }).as('apiRequest')
    cy.visit(urls.dashboard.investmentProjects())
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"]').as('tabList')
    cy.get('[data-test="tabpanel"]').as('tabPanel')
  })

  context('Tabbed navigation', () => {
    it('should have a heading of `No investment projects`', () => {
      cy.get('@tabPanel')
        .find('h1')
        .should('have.text', 'No investment projects')
    })

    it('should have a heading paragraph', () => {
      cy.get('@tabPanel')
        .find('p')
        .eq(0)
        .should(
          'have.text',
          'View and track investment projects from your dashboard'
        )
    })

    it('should have an image of the stage timeline and estimated land date', () => {
      cy.get('@tabPanel').find('img').should('have.attr', 'alt', '')
    })

    it('should have a body paragraph', () => {
      cy.get('@tabPanel')
        .find('p')
        .eq(1)
        .should('have.text', "Once added, you'll be able to:")
    })

    it('should have a list with 4 items', () => {
      cy.get('@tabPanel').find('ul').children().should('have.length', 4)
    })

    it('should have a list with informative information', () => {
      cy.get('@tabPanel')
        .find('ul')
        .children()
        .first()
        .should('have.text', 'view the progress of each project')
        .next()
        .should('have.text', 'move projects onto the next stage')
        .next()
        .should('have.text', 'view estimated land dates')
        .next()
        .should(
          'have.text',
          'view project summaries for the next financial year.'
        )
    })

    it('should have a link to the investment projects page', () => {
      cy.get('@tabPanel')
        .find('a')
        .should('have.text', 'Add project')
        .and('have.attr', 'href', urls.investments.index())
    })
  })
})
