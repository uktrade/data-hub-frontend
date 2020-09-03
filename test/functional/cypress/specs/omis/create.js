const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Omis Create Required Fields', () => {
  before(() => {
    cy.visit(
      `${urls.omis.create(fixtures.company.withContacts.id)}&skip-company=true`
    )
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('datahub.sid')
  })

  it('should validate contact required field', () => {
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.validationMsg)
      .should('contain', 'Contact responsible for the order cannot be blank')
      .and('have.attr', 'href', '#group-field-contact')

    cy.get(selectors.omisCreate.contact).select('Johnny Cakeman')
    cy.get(selectors.omisCreate.continue).click()
  })

  it('should validate market required field', () => {
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.validationMsg)
      .should(
        'contain',
        'Country where the service is required cannot be blank'
      )
      .and('have.attr', 'href', '#group-field-primary_market')

    cy.get(selectors.omisCreate.country).select('Angola')
    cy.get(selectors.omisCreate.continue).click()
  })

  it('should validate sector required fields', () => {
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.validationMsg)
      .should(
        'contain',
        'Do you want to use the company’s primary sector (shown above) for this order? cannot be blank'
      )
      .and('have.attr', 'href', '#group-field-use_sector_from_company')
    cy.get(selectors.omisCreate.suggestedSectorMsg).should('contain', 'Retail')

    cy.get(selectors.omisCreate.sectorNo).click()
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.validationMsg)
      .should('contain', 'Sector cannot be blank')
      .and('have.attr', 'href', '#group-field-sector')

    cy.get(selectors.omisCreate.sector).select('Aerospace')
    cy.get(selectors.omisCreate.continue).click()

    cy.get(selectors.omisSummary.company)
      .should('contain', 'Venus Ltd')
      .and('contain', '66 Marcham Road, Bordley, BD23 8RZ')
  })
})

describe('Omis Archived Company', () => {
  before(() => {
    cy.visit(urls.companies.orders(fixtures.company.archivedLtd.id))
  })

  it('should display "Why can I not add an order?" message', () => {
    cy.contains('Why can I not add an order?').click()
    cy.contains(
      'Orders cannot be added to an archived company. Click here to unarchive'
    )
    cy.contains('Click here to unarchive').should(
      'have.attr',
      'href',
      urls.companies.unarchive(fixtures.company.archivedLtd.id)
    )
  })
})
