const {
  assertTabbedLocalNav,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

describe('Investment opportunities', () => {
  context('When there are 12 opportunities and viewing the first page', () => {
    beforeEach(() => {
      cy.visit(investments.opportunities.index())
    })

    it('should render the header', () => {
      cy.get('h1').contains('UK opportunities')
    })

    it('should render the opportunities note', () => {
      cy.get('[data-test="opportunities-note"]')
        .should('be.visible')
        .get('[data-test="opportunities-note"] > p')
        .should('have.length', 3)
        .find('a')
        .should('have.attr', 'href', 'mailto:capitalinvestment@trade.gov.uk')
        .should('have.text', 'capitalinvestment@trade.gov.uk')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        'UK opportunities': null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('EYB leads')
      assertTabbedLocalNav('Investor profiles')
      assertTabbedLocalNav('UK opportunities')
    })

    it('should display add opportunity button', () => {
      cy.get('[data-test="collection-header"]')
        .find('a')
        .should('have.attr', 'href', investments.opportunities.create())
        .should('have.text', 'Add opportunity')
    })

    it('should display 10 opportunities', () => {
      cy.get('h3').should('have.length', 10)
    })

    it('should display download opportunities text', () => {
      cy.get('[data-test="download-data-header"]').should(
        'contain',
        'You can now download these 12 opportunities'
      )
    })

    it('should display download opportunities button', () => {
      cy.get('[data-test="download-data-header"] > div > a')
        .should('be.visible')
        .should('have.attr', 'href', '/investments/opportunities/export')
    })
    it('should display opportunity name and created on date where no modified date', () => {
      cy.get('[data-test="collection-item"]')
        .eq(0)
        .should('contain', 'A non-modified opportunity')
        .should('contain', 'Updated on')
        .and('contain', '13 May 2019')
    })
    it('should display opportunity name and modified date', () => {
      cy.get('[data-test="collection-item"]')
        .eq(1)
        .should('contain', 'A modified opportunity')
        .should('contain', 'Updated on')
        .and('contain', '10 April 2021')
    })
  })
})
