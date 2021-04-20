const { companies, interactions } = require('../../../../../src/lib/urls')

describe('Dashboard - Investment details', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-details"]').as('allInvestmentDetails')
    cy.get('[data-test="investment-details"]').eq(0).as('firstProjectDetails')
    cy.get('[data-test="investment-details"]').eq(1).as('secondProjectDetails')
    cy.get('[data-test="investment-details"]').eq(2).as('thirdProjectDetails')
    cy.get('@firstProjectDetails').find('dt').as('allTerms')
    cy.get('@firstProjectDetails').find('dd').as('allDescriptions')
  })

  it('should have a details section for each project', () => {
    cy.get('@allInvestmentDetails').should('have.length', 10)
  })

  it("should display 'Details' in a h3 header", () => {
    cy.get('@firstProjectDetails').find('h3').should('have.text', 'Details')
  })

  it('should display the investor details with a link to the investor', () => {
    cy.get('@allTerms')
      .eq(0)
      .should('have.text', 'Investor:')
      .get('@allDescriptions')
      .eq(0)
      .children()
      .should('have.text', 'Venus Ltd')
      .should(
        'have.attr',
        'href',
        companies.details('0f5216e0-849f-11e6-ae22-56b6b6499611')
      )
  })

  it('should display the sector details', () => {
    cy.get('@allTerms')
      .eq(1)
      .should('have.text', 'Sector:')
      .get('@allDescriptions')
      .eq(1)
      .should('have.text', 'Renewable Energy : Wind : Onshore')
  })

  it('should display the country of origin details', () => {
    cy.get('@allTerms')
      .eq(2)
      .should('have.text', 'Country of origin:')
      .get('@allDescriptions')
      .eq(2)
      .should('have.text', 'Italy')
  })

  it('should display the date of the last interaction', () => {
    cy.get('@allTerms')
      .eq(3)
      .should('have.text', 'Last interaction:')
      .get('@allDescriptions')
      .eq(3)
      .should('have.text', '16 Mar 2021')
  })

  it('should display the last interaction subject with a link to the interaction', () => {
    cy.get('@allTerms')
      .eq(4)
      .should('have.text', 'Interaction subject:')
      .get('@allDescriptions')
      .eq(4)
      .children()
      .should('have.text', 'A project interaction')
      .should(
        'have.attr',
        'href',
        interactions.detail('3fd90013-4bcb-4c39-b8df-df264471ea85')
      )
  })

  context("when a project doesn't have a country of origin", () => {
    it('should not contain a country of origin', () => {
      cy.get('@secondProjectDetails').should('not.contain', 'Country of origin')
    })
  })

  context("when a project doesn't have an interaction", () => {
    it('should not contain an interaction', () => {
      cy.get('@thirdProjectDetails')
        .should('not.contain', 'Last interaction')
        .get('@thirdProjectDetails')
        .should('not.contain', 'Interaction subject')
    })
  })
})
