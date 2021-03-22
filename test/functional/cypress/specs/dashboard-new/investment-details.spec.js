const { companies, interactions } = require('../../../../../src/lib/urls')

describe('Dashboard - Investment details', () => {
  beforeEach(() => {
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/')
    cy.get('[data-test="tablist"] span:first-child button').click()
    cy.get('[data-test="investment-details"]').as('allDetails')
    cy.get('[data-test="investment-details"]').eq(1).as('secondProjectDetails')
    cy.get('[data-test="investment-details"]').eq(2).as('thirdProjectDetails')
    cy.get('[data-test="investment-details"]')
      .eq(0)
      .find('h3')
      .as('header')
      .next()
      .find('li')
      .as('listItem')
  })
  after(() => {
    cy.resetFeatureFlags()
  })

  it('should have a details section for each project', () => {
    cy.get('@allDetails').should('have.length', 10)
  })

  it('should display a header', () => {
    cy.get('@header').should('have.text', 'Details')
  })

  it('should display the investor details with a link to the investor', () => {
    cy.get('@listItem')
      .eq(0)
      .should('have.text', 'Investor: Venus Ltd')
      .find('a')
      .should(
        'have.attr',
        'href',
        companies.details('0f5216e0-849f-11e6-ae22-56b6b6499611')
      )
  })
  it('should display the sector details', () => {
    cy.get('@listItem')
      .eq(1)
      .should('have.text', 'Sector: Renewable Energy : Wind : Onshore')
  })
  it('should display the country of origin details', () => {
    cy.get('@listItem').eq(2).should('have.text', 'Country of origin: Italy')
  })
  it('should display the date of the last interaction', () => {
    cy.get('@listItem')
      .eq(3)
      .should('have.text', 'Last interaction: 16 Mar 2021')
  })
  it('should display the last interaction subject with a link to the interaction', () => {
    cy.get('@listItem')
      .eq(4)
      .should('have.text', 'Interaction subject: A project interaction')
      .find('a')
      .should(
        'have.attr',
        'href',
        interactions.detail('3fd90013-4bcb-4c39-b8df-df264471ea85')
      )
      .should('have.text', 'A project interaction')
  })

  context("when a project doesn't have a country of origin", () => {
    it('should not contain a country of origin', () => {
      cy.get('@secondProjectDetails').should('not.contain', 'Country of origin')
    })
  })
  context("when a project doesn't have an interaction", () => {
    it('should not contain an interaction', () => {
      cy.get('@thirdProjectDetails').should('not.contain', 'Last interaction')
      cy.get('@thirdProjectDetails').should(
        'not.contain',
        'Interaction subject'
      )
    })
  })
})
