import urls from '../../../../../src/lib/urls'

import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
  assertElementsInOrder,
  assertTypeaheadHasLabelAndPlaceholder,
  assertTypeaheadOptionSelected,
} from '../../support/assertions'
import {
  selectFirstAdvisersTypeaheadOption,
  clickCheckboxGroupOption,
  selectFirstTypeaheadOption,
} from '../../support/actions'

const PROSPECT_STAGE_ID = '8a320cc9-ae2e-443e-9d26-2f36452c2ced'
const PUCK_ADVISER_ID = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const UK_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const SOUTH_EAST_UK_REGION_ID = '884cd12a-6095-e211-a939-e4115bead28a'
const FDI_INVESTMENT_TYPE_ID = '3e143372-496c-4d1e-8278-6fdd3da9b48b'

/**
 * Tests that a typeahead functions correctly by inputing a value and selecting
 */
const testTypeahead = ({
  element,
  label,
  placeholder,
  input,
  expectedOption,
}) => {
  assertTypeaheadHasLabelAndPlaceholder({ element, label, placeholder })
  selectFirstTypeaheadOption({ element, input })
  assertTypeaheadOptionSelected({ element, expectedOption })
}

/**
 * Tests that clicking the first indicator button clears a filter element
 */
const testRemoveChip = ({ element, placeholder = null }) => {
  cy.get('#filter-chips').as('filterChips').find('button').click()
  cy.get('@filterChips').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}

describe('Investments Collections Filter', () => {
  beforeEach(() => {
    cy.get('#field-stage').as('stageFilter')
    cy.get('#field-advisers').as('adviserFilter')
    cy.get('#field-sector').as('sectorFilter')
    cy.get('#field-country').as('countryFilter')
    cy.get('#field-uk_region').as('ukRegionFilter')
    cy.get('#field-investment_type').as('investmentTypeFilter')
    cy.get('#field-estimated_land_date_before').as('estimatedDateBefore')
    cy.get('#field-estimated_land_date_after').as('estimatedDateAfter')
    cy.get('#field-actual_land_date_before').as('actualDateBefore')
    cy.get('#field-actual_land_date_after').as('actualDateAfter')
  })

  context('when the url contains no state', () => {
    before(() => {
      cy.visit(urls.investments.projects.index())
    })

    it('should contain filter fields in the right order', () => {
      const expectedIdentifiers = [
        'field-stage',
        'field-advisers',
        'field-sector',
        'field-country',
        'field-uk_region',
        'field-investment_type',
        'field-estimated_land_date_before',
        'field-estimated_land_date_after',
        'field-actual_land_date_before',
        'field-actual_land_date_after',
      ]
      cy.get('#company-information-filters')
        .should('exist')
        .find('button')
        .should('exist')
        .next()
        .should('exist')
        .children()
        .as('filterFields')

      assertElementsInOrder({
        parentElement: '@filterFields',
        expectedIdentifiers,
      })
    })

    it('should filter by stage', () => {
      clickCheckboxGroupOption({
        element: '@stageFilter',
        value: PROSPECT_STAGE_ID,
      })
      assertCheckboxGroupOption({
        element: '@stageFilter',
        value: PROSPECT_STAGE_ID,
        checked: true,
      })
      cy.get('@stageFilter').should('contain', 'Prospect')
      assertChipExists({ label: 'Prospect', position: 1 })

      testRemoveChip({ element: '@stageFilter' })
    })

    it('should filter by advisers', () => {
      cy.get('@adviserFilter')
        .should('contain', 'Search advisers')
        .find('label')
        .should('have.text', 'Advisers')

      selectFirstAdvisersTypeaheadOption({
        element: '@adviserFilter',
        input: 'puc',
      })
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertChipExists({ label: 'Puck Head', position: 1 })

      testRemoveChip({
        element: '@adviserFilter',
        placeholder: 'Search advisers',
      })
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        label: 'Sector',
        placeholder: 'Search sectors',
        input: 'adv',
        expectedOption: 'Advanced Engineering',
      })

      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sectors',
      })
    })

    it('should filter by country', () => {
      testTypeahead({
        element: '@countryFilter',
        label: 'Country of origin',
        placeholder: 'Search countries',
        input: 'sin',
        expectedOption: 'Singapore',
      })

      testRemoveChip({
        element: '@countryFilter',
        placeholder: 'Search countries',
      })
    })

    it('should filter by uk region', () => {
      testTypeahead({
        element: '@ukRegionFilter',
        label: 'UK Region',
        placeholder: 'Search UK region',
        input: 'sou',
        expectedOption: 'South East',
      })

      testRemoveChip({
        element: '@ukRegionFilter',
        placeholder: 'Search UK regions',
      })
    })

    it('should filter by investment type', () => {
      clickCheckboxGroupOption({
        element: '@investmentTypeFilter',
        value: FDI_INVESTMENT_TYPE_ID,
      })
      assertCheckboxGroupOption({
        element: '@investmentTypeFilter',
        value: FDI_INVESTMENT_TYPE_ID,
        checked: true,
      })
      cy.get('@investmentTypeFilter').should('contain', 'FDI')
      assertChipExists({ label: 'FDI', position: 1 })

      testRemoveChip({ element: '@investmentTypeFilter' })
    })

    it('should filter the estimated land date before', () => {
      cy.get('@estimatedDateBefore')
        .find('label')
        .should('have.text', 'Estimated land date before')
        .next()
        .click()
        .type('2020-01-01')
      assertChipExists({
        label: 'Estimated land date before : 1 January 2020',
        position: 1,
      })

      testRemoveChip({ element: '@estimatedDateBefore' })
    })

    it('should filter the estimated land date after', () => {
      cy.get('@estimatedDateAfter')
        .find('label')
        .should('have.text', 'Estimated land date after')
        .next()
        .click()
        .type('2020-01-02')
      assertChipExists({
        label: 'Estimated land date after : 2 January 2020',
        position: 1,
      })

      testRemoveChip({ element: '@estimatedDateBefore' })
    })

    it('should filter the actual land date before', () => {
      cy.get('@actualDateBefore')
        .find('label')
        .should('have.text', 'Actual land date before')
        .next()
        .click()
        .type('2020-02-01')
      assertChipExists({
        label: 'Actual land date before : 1 February 2020',
        position: 1,
      })

      testRemoveChip({ element: '@actualDateBefore' })
    })

    it('should filter the actual land date after', () => {
      cy.get('@actualDateAfter')
        .find('label')
        .should('have.text', 'Actual land date after')
        .next()
        .click()
        .type('2020-02-02')
      assertChipExists({
        label: 'Actual land date after : 2 February 2020',
        position: 1,
      })

      testRemoveChip({ element: '@actualDateBefore' })
    })
  })

  context('when the url contains state', () => {
    before(() => {
      cy.visit(urls.investments.projects.index(), {
        qs: {
          stage: PROSPECT_STAGE_ID,
          adviser: PUCK_ADVISER_ID,
          sector_descends: ADVANCED_ENGINEERING_SECTOR_ID,
          country: UK_COUNTRY_ID,
          uk_region: SOUTH_EAST_UK_REGION_ID,
          investment_type: FDI_INVESTMENT_TYPE_ID,
          estimated_land_date_before: '2020-01-01',
          estimated_land_date_after: '2020-01-02',
          actual_land_date_before: '2020-02-01',
          actual_land_date_after: '2020-02-02',
        },
      })
    })
    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: 'Prospect' })
      assertCheckboxGroupOption({
        element: '@stageFilter',
        value: PROSPECT_STAGE_ID,
        checked: true,
      })
      assertChipExists({ position: 2, label: 'Puck Head' })
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertChipExists({ position: 3, label: 'Advanced Engineering' })
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      assertChipExists({ position: 4, label: 'United Kingdom' })
      cy.get('@countryFilter').should('contain', 'United Kingdom')
      assertChipExists({ position: 5, label: 'South East' })
      cy.get('@ukRegionFilter').should('contain', 'South East')
      assertChipExists({ position: 6, label: 'FDI' })
      assertCheckboxGroupOption({
        element: '@investmentTypeFilter',
        value: FDI_INVESTMENT_TYPE_ID,
        checked: true,
      })
      assertChipExists({
        label: 'Estimated land date before : 1 January 2020',
        position: 7,
      })
      cy.get('@estimatedDateBefore')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
      assertChipExists({
        label: 'Estimated land date after : 2 January 2020',
        position: 8,
      })
      cy.get('@estimatedDateAfter')
        .find('input')
        .should('have.attr', 'value', '2020-01-02')
      assertChipExists({
        label: 'Actual land date before : 1 February 2020',
        position: 9,
      })
      cy.get('@actualDateBefore')
        .find('input')
        .should('have.attr', 'value', '2020-02-01')
      assertChipExists({
        label: 'Actual land date after : 2 February 2020',
        position: 10,
      })
      cy.get('@actualDateAfter')
        .find('input')
        .should('have.attr', 'value', '2020-02-02')
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 10)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)
      cy.get('@estimatedDateBefore')
        .find('input')
        .should('have.attr', 'value', '')
      cy.get('@estimatedDateAfter')
        .find('input')
        .should('have.attr', 'value', '')
      cy.get('@adviserFilter').should('contain', 'Search advisers...')
      cy.get('@sectorFilter').should('contain', 'Search sectors...')
      cy.get('@countryFilter').should('contain', 'Search countries...')
      cy.get('@ukRegionFilter').should('contain', 'Search UK regions...')
      assertCheckboxGroupNoneSelected('@stageFilter')
      assertCheckboxGroupNoneSelected('@investmentTypeFilter')
    })
  })
})
