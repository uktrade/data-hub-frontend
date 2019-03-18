const fixtures = require('../../../fixtures/index.js')
const selectors = require('../../../selectors/index.js')

const baseUrl = Cypress.config().baseUrl
const { oneListCorp } = fixtures.company

describe('Company Investments and Growth capital profile', () => {
  before(() => {
    cy.visit(`/companies/${oneListCorp.id}/investments/growth-capital-profile`)
  })

  context('when viewing the company header', () => {
    it('should display the "One List Corp" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'One List Corp')
    })
  })

  context('when viewing the 3 tabs', () => {
    it('should display an "Investments projects" tab with the correct URL', () => {
      cy.get(selectors.companyInvestment.investmentProjectsTab).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/projects`)
    })

    it('should display a "Large capital profile" tab with the correct URL', () => {
      cy.get(selectors.companyInvestment.largeCapitalProfileTab).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/large-capital-profile`)
    })

    it('should display a "Growth capital profile" tab with the correct URL', () => {
      cy.get(selectors.companyInvestment.growthCapitalProfileTab).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/growth-capital-profile`)
    })
  })

  context('when the Growth capital profile tab is selected', () => {
    it('should not have an "active" class on the "Investment projects" tab', () => {
      cy.get(selectors.companyInvestment.investmentProjectsTab).should('not.have.class', 'active')
    })

    it('should not have an "active" class on the "Large capital profile" tab', () => {
      cy.get(selectors.companyInvestment.largeCapitalProfileTab).should('not.have.class', 'active')
    })

    it('should have an "active" class on the "Growth capital profile" tab', () => {
      cy.get(selectors.companyInvestment.growthCapitalProfileTab).should('have.class', 'active')
    })
  })

  context('when viewing the tabbed area content', () => {
    it('should display the "Growth capital investor profile" subheading', () => {
      cy.get(selectors.companyInvestment.subHeading).should('have.text', 'Growth capital investor profile')
    })

    it('should display a "Create a profile" button when the company does not have a "Growth capital investor profile"', () => {
      cy.get(selectors.companyInvestment.createAProfile).should('have.text', 'Create a profile')
    })
  })
})
