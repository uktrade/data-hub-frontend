const {
  assertTabbedLocalNav,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

describe('Investor profiles', () => {
  context('When there are 12 profiles and viewing the first page', () => {
    before(() => {
      cy.visit(investments.profiles.index())
    })

    it('should render the header', () => {
      assertLocalHeader('Investments')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        Profiles: null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('Investor profiles')
    })

    it('should display 10 profiles', () => {
      cy.get('h3').should('have.length', 10)
    })

    it('should display 3 pagination links', () => {
      cy.get('ul:last li a').should('have.length', 3)
    })

    it('should display the next button', () => {
      cy.get('ul:last li a:last').should('have.text', 'Next')
    })

    it('should not display the previous button', () => {
      cy.get('ul:last li a:first').should('not.have.text', 'Previous')
    })
  })

  context('When there are 12 profiles and viewing the second page', () => {
    before(() => {
      cy.visit(investments.profiles.index())
    })

    it('should render the header', () => {
      assertLocalHeader('Investments')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        Profiles: null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('Investor profiles')
    })

    it('should be able to navigate to the second page', () => {
      cy.get('ul:last li a').contains('2').click()
    })

    it('should display 2 profiles', () => {
      cy.get('h3').should('have.length', 2)
    })

    it('should display 3 pagination links', () => {
      cy.get('ul:last li a').should('have.length', 3)
    })

    it('should not display the next button', () => {
      cy.get('ul:last li a:last').should('not.have.text', 'Next')
    })

    it('should display the previous button', () => {
      cy.get('ul:last li a:first').should('have.text', 'Previous')
    })
  })
})
