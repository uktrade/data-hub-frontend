import { selectFirstMockedTypeaheadOption } from '../../support/actions'

import {
  assertTypeaheadOptionSelected,
  assertSingleTypeaheadOptionSelected,
} from '../../support/assertions'

const { assertPayload } = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')
const completeOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const incompleteOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-incomplete.json')
const ukRegions = require('../../../../sandbox/fixtures/metadata/uk-region.json')
const promoters = require('../../../../sandbox/fixtures/v4/search/company.json')
const requiredChecks = require('../../../../sandbox/fixtures/metadata/capital-investment-required-checks.json')
const requiredChecksConductedBy = require('../../../../sandbox/fixtures/autocomplete-adviser-list.json')
const constructionRisk = require('../../../../sandbox/fixtures/metadata/capital-investment-construction-risks.json')
const relationshipManager = require('../../../../sandbox/fixtures/autocomplete-adviser-list.json')
const otherDITContacts = require('../../../../sandbox/fixtures/autocomplete-adviser-list.json')
const valueType = require('../../../../sandbox/fixtures/metadata/capital-investment-opportunity-value-types.json')
const assetClasses = require('../../../../sandbox/fixtures/metadata/capital-investment-asset-class-interest.json')

const filteredUKRegions = ukRegions.filter((region) => !region.disabled_on)

const expectedPayload = {
  name: 'A really good Opportunity',
  description: 'Some long description about this opportunity',
  uk_region_locations: [filteredUKRegions[0].id, filteredUKRegions[1].id],
  promoters: [promoters.results[0].id, promoters.results[1].id],
  required_checks_conducted: requiredChecks[0].id,
  required_checks_conducted_by: requiredChecksConductedBy.results[0].id,
  required_checks_conducted_on: '2021-01-01',
  construction_risks: [constructionRisk[0].id],
  lead_dit_relationship_manager: relationshipManager.results[0].id,
  other_dit_contacts: [
    otherDITContacts.results[0].id,
    otherDITContacts.results[1].id,
  ],
  opportunity_value_type: valueType[0].id,
  opportunity_value: '123456',
  asset_classes: [assetClasses[0].id, assetClasses[1].id, assetClasses[2].id],
}

const navigateToForm = (opportunity) => {
  cy.visit(investments.opportunities.details(opportunity.id))
}

describe('A capital opportunity with no existing details', () => {
  context('When editing an opportunity', () => {
    beforeEach(() => {
      navigateToForm(incompleteOpportunity)
      cy.get(
        '#opportunity_details_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('#opportunity_details_toggle')
        .contains('Edit')
        .should('be.visible')
      cy.get('#opportunity_details_toggle').contains('Edit').click()
    })
    it('should display the details form when you click "Edit"', () => {
      cy.get('form').should('be.visible')
    })
    it('should take user back to the table view if they click "Cancel"', () => {
      cy.contains('Cancel').click()
      cy.get(
        '#opportunity_details_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('table').should('be.visible')
    })
    it('should allow the form to be submitted with just the name field filled in', () => {
      cy.contains('Save').click()
      cy.get('table').should('be.visible')
    })
    it('should give an error if the name field is not filled in', () => {
      cy.get('#name').clear()
      cy.contains('Save').click()
      cy.get('#form-errors').should('be.visible')
      cy.get('#form-errors').should('contain', 'Enter a name')
    })
    it('should give an error if anything but a number is entered for the opportunity value field', () => {
      cy.get(`[value=${valueType[0].id}]`).check()
      cy.get('#opportunityValue').type('hello')
      cy.contains('Save').click()
      cy.get('#form-errors').should('be.visible')
      cy.get('#form-errors').should('contain', 'Value must be a number')
    })

    it('should allow the user to complete all fields', () => {
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/large-capital-opportunity/${incompleteOpportunity.id}`
      ).as('apiRequest')

      cy.get('#name').clear().type('A really good Opportunity')
      cy.get('#description').type(
        'Some long description about this opportunity'
      )
      cy.get('#field-ukRegions')
        .selectTypeaheadOption(filteredUKRegions[0].name)
        .selectTypeaheadOption(filteredUKRegions[1].name)
      cy.contains('Promoters')
        .parent()
        .parent()
        .selectTypeaheadOption(promoters.results[0].name)
        .selectTypeaheadOption(promoters.results[1].name)
      cy.contains('Has this opportunity cleared the required checks?')
        .next()
        .find('input')
        .check(requiredChecks[0].id)
      cy.get('#requiredChecksConductedOn\\.day').type('01')
      cy.get('#requiredChecksConductedOn\\.month').type('01')
      cy.get('#requiredChecksConductedOn\\.year').type('2021')
      selectFirstMockedTypeaheadOption({
        element: '#field-requiredChecksConductedBy',
        input: requiredChecksConductedBy.results[0].name,
      })
      cy.contains('Construction risk')
        .next()
        .find('input')
        .check(constructionRisk[0].id)
      selectFirstMockedTypeaheadOption({
        element: '#field-leadRelationshipManager',
        input: relationshipManager.results[0].name,
      })
      selectFirstMockedTypeaheadOption({
        element: '#field-otherDitContacts',
        input: otherDITContacts.results[0].name,
      })
      selectFirstMockedTypeaheadOption({
        element: '#field-otherDitContacts',
        input: otherDITContacts.results[1].name,
      })
      cy.get('#field-valueType').find('input').check(valueType[0].id)
      cy.get('#opportunityValue').type('123456')
      cy.contains('Asset classes')
        .parent()
        .parent()
        .selectTypeaheadOption(assetClasses[0].name)
        .selectTypeaheadOption(assetClasses[1].name)
        .selectTypeaheadOption(assetClasses[2].name)
      cy.contains('Save').click()
      assertPayload('@apiRequest', expectedPayload)
      cy.get('table').should('be.visible')
    })
  })

  context('When editing an opportunity with existing details', () => {
    before(() => {
      navigateToForm(completeOpportunity)
      cy.get(
        '#opportunity_details_toggle > div > [data-test="toggle-section-button"]'
      ).click()
      cy.get('#opportunity_details_toggle').contains('Edit').click()
    })
    it('should display existing values in the form', () => {
      cy.get('#name').should('have.value', completeOpportunity.name)
      cy.get('#description').should(
        'have.value',
        completeOpportunity.description
      )
      assertTypeaheadOptionSelected({
        element: '#field-ukRegions',
        expectedOption: completeOpportunity.uk_region_locations[0].name,
      })
      assertTypeaheadOptionSelected({
        element: '#field-promoters',
        expectedOption: completeOpportunity.promoters[0].name,
      })
      cy.get(
        `[value=${completeOpportunity.required_checks_conducted.id}]`
      ).should('be.checked')
      cy.get('#requiredChecksConductedOn\\.day').should('have.value', '6')
      cy.get('#requiredChecksConductedOn\\.month').should('have.value', '7')
      cy.get('#requiredChecksConductedOn\\.year').should('have.value', '2018')
      assertSingleTypeaheadOptionSelected({
        element: '#field-requiredChecksConductedBy',
        expectedOption: completeOpportunity.required_checks_conducted_by.name,
      })
      cy.get(`[value=${completeOpportunity.construction_risks[0].id}]`).should(
        'be.checked'
      )
      assertSingleTypeaheadOptionSelected({
        element: '#field-leadRelationshipManager',
        expectedOption: completeOpportunity.lead_dit_relationship_manager.name,
      })
      assertTypeaheadOptionSelected({
        element: '#field-otherDitContacts',
        expectedOption: completeOpportunity.other_dit_contacts[0].name,
      })
      cy.get(`[value=${completeOpportunity.opportunity_value_type.id}]`).should(
        'be.checked'
      )
      cy.get('#opportunityValue').should(
        'have.value',
        completeOpportunity.opportunity_value
      )
      assertTypeaheadOptionSelected({
        element: '#field-assetClasses',
        expectedOption: completeOpportunity.asset_classes[0].name,
      })
    })
  })
})
