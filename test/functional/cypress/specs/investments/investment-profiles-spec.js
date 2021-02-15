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

    it('should display download profile text', () => {
      cy.get('[data-test="download-data-header"]').should(
        'contain',
        'You can now download these 12 profiles'
      )
    })

    it('should display download profile button', () => {
      cy.get('[data-test="download-data-header"] > div > a')
        .should('be.visible')
        .should('have.attr', 'href', '/investments/profiles/export')
    })

    it('should display 10 profiles', () => {
      cy.get('h3').should('have.length', 10)
    })

    it('should display 3 pagination links', () => {
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a').should('have.length', 3)
      })
    })

    it('should display the next button', () => {
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a:last').should('have.text', 'Next')
      })
    })

    it('should not display the previous button', () => {
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a:first').should('not.have.text', 'Previous')
      })
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
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a').contains('2').click()
      })
    })

    it('should display 2 profiles', () => {
      cy.get('h3').should('have.length', 2)
    })

    it('should display 3 pagination links', () => {
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a').should('have.length', 3)
      })
    })

    it('should not display the next button', () => {
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a:last').should('not.have.text', 'Next')
      })
    })

    it('should display the previous button', () => {
      cy.get('#large-capital-profile-collection').within(() => {
        cy.get('ul:last li a:first').should('have.text', 'Previous')
      })
    })
  })
})
