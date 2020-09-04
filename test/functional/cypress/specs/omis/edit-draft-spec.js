const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Omis Edit Draft', () => {
  const data = {
    contact: {
      name:
        'Kameron Durgan|1f19804c-8156-4bd7-80c0-5291d9c776f9, Regional Security Engineer',
      email: 'Kameron_Durgan1f19804c-8156-4bd7-80c0-5291d9c776f983@yahoo.com',
    },
    country: 'Argentina',
    sector: 'Aerospace',
  }

  before(() => {
    cy.visit(
      `/omis/create/?company=${fixtures.company.withContacts.id}&skip-company=true`
    )
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

  it('should create a omis draft', () => {
    cy.get(selectors.omisCreate.contact).select(data.contact.name)
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisCreate.country).select(data.country)
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisCreate.sectorNo).click()
    cy.get(selectors.omisCreate.sector).select(data.sector)
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.company)
      .should('contain', 'Venus Ltd')
      .and('contain', '66 Marcham Road, Bordley, BD23 8RZ')

    cy.get(selectors.omisSummary.contact)
      .should('contain', data.contact.name)
      .and('contain', data.contact.email)

    cy.get(selectors.omisSummary.country).should('contain', data.country)

    cy.get(selectors.omisSummary.sector).should('contain', data.sector)
  })

  it('should edit contact details', () => {
    cy.get(selectors.omisSummary.editContactLink).click()

    cy.get(selectors.omisCreate.contact).select('Johnny Cakeman')
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.contact)
      .should('contain', 'Johnny Cakeman')
      .and('contain', 'johnny@cakeman.com')
  })

  it('should edit country details', () => {
    cy.get(selectors.omisSummary.editCountryLink).click()

    cy.get(selectors.omisCreate.country).select('Angola')
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.country).should('contain', 'Angola')
  })

  it('should edit sector details', () => {
    cy.get(selectors.omisSummary.editSectorLink).click()

    cy.get(selectors.omisCreate.sectorYes).click()
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.sector).should('contain', 'Retail')
  })
})
