const {
  ZERO_INVESTMENT_PROJECTS,
} = require('../../../../sandbox/constants/dashboard')
const urls = require('../../../../../src/lib/urls')

describe('Dashboard - no investment projects', () => {
  beforeEach(() => {
    cy.setAdviserId(ZERO_INVESTMENT_PROJECTS)
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/myinvestmentprojects')
    cy.get('[data-test="tablist"]').as('tabList')
    cy.get('[data-test="tabpanel"]').as('tabPanel')
  })
  after(() => {
    cy.resetFeatureFlags()
    cy.resetAdviserId()
  })

  context('Tabbed navigation', () => {
    it('should contain two tabs named "Investment projects" and "Company lists"', () => {
      cy.get('@tabList')
        .find('button')
        .eq(0)
        .should('have.text', 'Investment projects')

      cy.get('@tabList')
        .find('button')
        .eq(1)
        .should('have.text', 'Company lists')
    })

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
      cy.get('@tabPanel')
        .find('img')
        .should(
          'have.attr',
          'alt',
          'An image of the stage timeline and estimated land date'
        )
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
          'view project summaries for the next financial year'
        )
    })

    it('should have a link to the investment projects page', () => {
      cy.get('@tabPanel')
        .find('a')
        .should('have.text', 'View projects')
        .and('have.attr', 'href', urls.investments.index())
    })
  })
})
