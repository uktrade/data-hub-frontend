const { localHeader, companyInvestment: selectors } = require('../../../selectors')
const fixtures = require('../../../fixtures')
const baseUrl = Cypress.config().baseUrl
const { oneListCorp } = fixtures.company

describe('Company Investments and Growth capital profile', () => {
  before(() => {
    cy.visit(`/companies/${oneListCorp.id}/investments/growth-capital-profile`)
  })

  context('when viewing the company header', () => {
    it('should display the "One List Corp" heading', () => {
      cy.get(localHeader().heading).should('have.text', 'One List Corp')
    })
  })

  context('when viewing the 3 tabs', () => {
    it('should display an "Investments projects" tab with the correct URL', () => {
      cy.get(selectors.tabs.investmentProjects).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/projects`)
    })

    it('should display a "Large capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.largeCapitalProfile).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/large-capital-profile`)
    })

    it('should display a "Growth capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.growthCapitalProfile).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/growth-capital-profile`)
    })
  })

  context('when the Growth capital profile tab is selected', () => {
    it('should not have an "active" class on the "Investment projects" tab', () => {
      cy.get(selectors.tabs.investmentProjects).should('not.have.class', 'active')
    })

    it('should not have an "active" class on the "Large capital profile" tab', () => {
      cy.get(selectors.tabs.largeCapitalProfile).should('not.have.class', 'active')
    })

    it('should have an "active" class on the "Growth capital profile" tab', () => {
      cy.get(selectors.tabs.growthCapitalProfile).should('have.class', 'active')
    })
  })

  context('when viewing the tabbed area content', () => {
    it('should display the "Growth capital investor profile" subheading', () => {
      cy.get(selectors.subHeading).should('have.text', 'Growth capital investor profile')
    })

    it('should display a "Create a profile" button when the company does not have a "Growth capital investor profile"', () => {
      cy.get(selectors.createAProfile).should('have.text', 'Create a profile')
    })
  })
})
