// const {
//   assertFormFields,
//   assertBreadcrumbs,
//   assertLocalHeader,
//   assertFieldInput,
//   assertFieldCheckbox,
//   assertFieldRadios,
// } = require('../../support/assertions')
// const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')

const opportunityWithCompleteRequirements = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const opportunityWithIncompleteRequirements = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-incomplete.json')

// const {
//   transformInvestmentOpportunityDetails,
// } = require('../../../../../src/apps/investments/client/opportunities/Details/transformers')

// const assertSelectFieldRadios = ({ element, legend, value }) =>
//   cy
//     .wrap(element)
//     .as('fieldRadio')
//     .find('legend')
//     .first()
//     .should('have.text', legend)
//     .parent()
//     .find('input')
//     .should('have.length', 4)
//     .then(() => value && cy.get('@fieldRadio').find('input:checked').next())

const navigateToForm = (opportunity) => {
  cy.visit(investments.opportunities.details(opportunity.id))
}

describe('A capital opportunity without existing requirements', () => {
  context('When editing an opportunity without existing requirements', () => {
    beforeEach(() => {
      navigateToForm(opportunityWithIncompleteRequirements)
      cy.get(
        '#opportunity_requirements_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('#opportunity_requirements_toggle').contains('Edit').click()
    })
    it('should display the requirements form when you click "Edit"', () => {
      cy.get('form').should('be.visible')
    })
    it('should take user back to the table view if they click "Cancel"', () => {
      cy.contains('Cancel').click()
      cy.get(
        '#opportunity_requirements_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('table').should('be.visible')
    })
    it('should allow the form to be submitted with no fields filled in (all optional)', () => {
      cy.contains('Save').click()
      cy.get('table').should('be.visible')
    })
    it('should give an error if a non-numerical value is given for GBP value fields', () => {
      cy.get('#total_investment_sought').type('hello')
      cy.get('#current_investment_secured').type('hello')
      cy.contains('Save').click()
      cy.get('#form-errors').should('be.visible')
      cy.get('#form-errors').should(
        'contain',
        'Total investment sought value must be a number'
      )
      cy.get('#form-errors').should(
        'contain',
        'Investment secured so far value must be a number'
      )
      cy.get('#field-total_investment_sought').should(
        'contain',
        'Total investment sought value must be a number'
      )
      cy.get('#field-current_investment_secured').should(
        'contain',
        'Investment secured so far value must be a number'
      )
    })
    it('should allow the user to fill in all fields', () => {
      cy.get('#total_investment_sought').type('100')
      cy.get('#current_investment_secured').type('200')
      cy.get('[type="checkbox"]').check('Direct Investment in Corporate Debt')
      cy.get('#estimated_return_rate').select('Up to 5% IRR')
      cy.get('#time_horizons').select('5-9 years')
      cy.contains('Save').click()
    })
    // TODO intercept request to API and check that the fields are right in it!!
  })

  context('When editing an opportunity with existing requirements', () => {
    beforeEach(() => {
      navigateToForm(opportunityWithCompleteRequirements)
      cy.get(
        '#opportunity_requirements_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('#opportunity_requirements_toggle').contains('Edit').click()
    })
    it('should diplay existing values in the form', () => {})
  })
})
