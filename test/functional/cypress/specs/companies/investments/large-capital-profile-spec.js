const { localHeader, companyInvestment: selectors } = require('../../../selectors')
const fixtures = require('../../../fixtures/index.js')
const baseUrl = Cypress.config().baseUrl
const { oneListCorp } = fixtures.company

describe('Company Investments and Large capital profile', () => {
  context('when viewing the company header', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display the "One List Corp" heading', () => {
      cy.get(localHeader().heading).should('have.text', 'One List Corp')
    })
  })

  context('when viewing the 3 tabs', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display an "Investments projects" tab with the correct URL', () => {
      cy.get(selectors.investmentProjectsTab).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/projects`)
    })

    it('should display a "Large capital profile" tab with the correct URL', () => {
      cy.get(selectors.largeCapitalProfileTab).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/large-capital-profile`)
    })

    it('should display a "Growth capital profile" tab with the correct URL', () => {
      cy.get(selectors.growthCapitalProfileTab).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/growth-capital-profile`)
    })
  })

  context('when the Large capital profile tab is selected', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should not have an "active" class on the "Investment projects" tab', () => {
      cy.get(selectors.investmentProjectsTab).should('not.have.class', 'active')
    })

    it('should have an "active" class on the "Large capital profile" tab', () => {
      cy.get(selectors.largeCapitalProfileTab).should('have.class', 'active')
    })

    it('should not have an "active" class on the "Growth capital profile" tab', () => {
      cy.get(selectors.growthCapitalProfileTab).should('not.have.class', 'active')
    })
  })

  context('when viewing the tabbed area content', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display the "Large capital investor profile" subheading', () => {
      cy.get(selectors.subHeading).should('have.text', 'Large capital investor profile')
    })
  })

  context('when clicking on a profile summary', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should expand the "Investor details" summary and have an enabled edit button', () => {
      cy.get(selectors.investorDetailsSummary).click()
        .get(selectors.investorDetailsEdit).should('be.visible').should('be.not.disabled')
    })

    it('should expand the "Investor requirements" summary and have an enabled edit button', () => {
      cy.get(selectors.investorRequirementsSummary).click()
        .get(selectors.investorRequirementsEdit).should('be.visible').should('be.not.disabled')
    })

    it('should expand the "Location" summary and have an enabled edit button', () => {
      cy.get(selectors.investorLocationSummary).click()
        .get(selectors.investorLocationEdit).should('be.visible').should('be.not.disabled')
    })
  })

  context('when editing the "Investor details" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor requirements" and "Location" edit button', () => {
      cy.get(selectors.investorDetailsEdit).click()
        .get(selectors.investorRequirementsEdit).should('be.disabled')
        .get(selectors.investorLocationEdit).should('be.disabled')
    })
  })

  context('when editing the "Investor requirements" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Location" edit button', () => {
      cy.get(selectors.investorRequirementsEdit).click()
        .get(selectors.investorDetailsEdit).should('be.disabled')
        .get(selectors.investorLocationEdit).should('be.disabled')
    })
  })

  context('when editing the "Location" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Investor requirements" edit button', () => {
      cy.get(selectors.investorLocationEdit).click()
        .get(selectors.investorDetailsEdit).should('be.disabled')
        .get(selectors.investorRequirementsEdit).should('be.disabled')
    })
  })
})

const visitLargeCapitalProfileAndExpandAllSections = () => {
  cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`)
    .get(selectors.investorDetailsSummary).click()
    .get(selectors.investorRequirementsSummary).click()
    .get(selectors.investorLocationSummary).click()
}
