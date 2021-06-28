const { 
  assertFormFields,
  assertBreadcrumbs,
  assertLocalHeader,
  assertFieldInput, 
  assertFieldCheckbox, 
  assertFieldRadios 
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { investments } = require('../../../../../src/lib/urls')
const { cy } = require('date-fns/locale')

const capitalOpportunitiesCompleteRequirements = require('../../fixtures/investment/large-capital-opportunity-complete.json')
const capitalOpportunitiesIncompleteRequirements = require('../../fixtures/investment/large-capital-opportunity-incomplete.json')

const { transformInvestmentOpportunityDetails } = require('../../../../../src/apps/investments/client/opportunities/Details/transformers')

const assertSelectFieldRadios = ({ element, legend, value }) => 
  cy 
    .wrap(element)
    .as('fieldRadio')
    .find('legend')
    .first()
    .should('have.text', legend)
    .parent()
    .find('input')
    .should('have.length', 4)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
    )

const navigateToForm = ({ opportunity }) => {
  cy.visit(investments.opportunities.details(opportunity.id))
}

const testOpportunityRequirementsForm = ({ opportunity }) => {
  const requirementsFields = transformInvestmentOpportunityDetails(opportunity)
  before(() => {
    navigateToForm({ requirementsFields })
    cy.get('[data-test="investment-opportunity-details"]').select('Opportunity requirements')
    cy.contains('Edit').click()
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Investments: '/investments',
      Opportunities: investments.opportunities.details(opportunity.id),
      [opportunity.name]: null,
    })
  })

  it('should render the header', () => {
    assertLocalHeader(opportunity.name)
  })

  it('should render expected form fields with existing values', () => {
    assertFormFields(cy.get('form'), [
      {
        assert: assertFieldInput,
        label: 'Total investment sought',
        value: requirementsFields.totalInvestmentSought,
      }, 
      {
        assert: assertFieldInput,
        label: 'Investment secured so far',
        value: requirementsFields.currentInvestmentSecured
      },
      {
        assert: assertFieldCheckbox,
        legend: 'Types of investment',
        value: requirementsFields.investmentTypes,
        optionCount: 8,
      },
      {
        assert: assertSelectFieldRadios,
        legend: 'Estimated return rate',
        value: requirementsFields.returnRateValues,
        optionsCount: 4,
      },
      {
        assert: assertSelectFieldRadios,
        legend: 'Timescales',
        value: requirementsFields.timeHorizonsValues,
        optionsCount: 4,
      },
    ])
  })

}

describe('Edit the capital opportunity requirements', () => {
  context('When editing capital opportunities without existing requirements data', () => {
    // testOpportunityRequirementsForm({ opportunity:  capitalOpportunitiesIncompleteRequirements })
    testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesCompleteRequirements })

    it('should allow the user to fill in all fields', () => {
      cy.get('[data-test="total_investment_sought"]').type('100')
      cy.get('[data-test="current_investment_secured"]').type('200')
      cy.get('[data-test="investment_types"]').select('Direct Investment in Corporate Debt')
      cy.get('[data-test="estimated_return_rate"]').select('Up to 5% IRR')
      cy.get('[data-test="time_horizons"]').select('5-9 years')
      cy.contains('Save').click()
    })
  })

  context('When editing capital opportunities with existing requirements data', () => {
    testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesCompleteRequirements })

    it('should diplay existing requirements values', () => {
      cy.get('[data-test="values"]').should('have.values')
    })
  })

  context('When making changes that miss-out required fields', () => {
    // testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesIncompleteRequirements })
    testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesCompleteRequirements })

    it('should highlight errorneous from input', () => {
      cy.get('[data-test="values"]')
        .should('have.class', 'has-error')
        .contains('required')
    })
  })

  context('When no changes with existing requirements data', () => {
    testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesCompleteRequirements })

    it('should allow to user to cancel and edit functionality', () => {
      cy.contains('Cancel').click()
    })
  })

  context('When no changes without existing requirements data', () => {
    // testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesIncompleteRequirements })
    testOpportunityRequirementsForm({ opportunity: capitalOpportunitiesCompleteRequirements })
    
    it('should allow to user to cancel and edit functionality', () => {
      cy.contains('Cancel').click()
    })
  })

})