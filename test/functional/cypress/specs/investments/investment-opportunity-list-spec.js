const {
  assertTabbedLocalNav,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

describe('Investment opportunities', () => {
  context('When there are 4 profiles and viewing the first page', () => {
    before(() => {
      cy.visit(investments.opportunities.index())
    })

    it('should render the header', () => {
      assertLocalHeader('Investments')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        'UK Opportunities': null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('Investor profiles')
      assertTabbedLocalNav('UK Opportunities')
    })

    it('should display add opportunity button', () => {
      cy.get('[data-test="collection-header"]')
        .find('a')
        .should('have.attr', 'href', investments.opportunities.create())
        .should('have.text', 'Add Opportunity')
    })

    it('should display 4 profiles', () => {
      cy.get('h3').should('have.length', 4)
    })
  })
})
