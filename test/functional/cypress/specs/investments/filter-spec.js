import urls from '../../../../../src/lib/urls'

import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
  assertElementsInOrder,
} from '../../support/assertions'
import {
  selectFirstAdvisersTypeaheadOption,
  clickCheckboxGroupOption,
} from '../../support/actions'
import { testTypeahead, testRemoveChip } from '../../support/tests'

const PROSPECT_STAGE_ID = '8a320cc9-ae2e-443e-9d26-2f36452c2ced'
const MY_ADVISER_ID = '7d19d407-9aec-4d06-b190-d3f404627f21'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const UK_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const SOUTH_EAST_UK_REGION_ID = '884cd12a-6095-e211-a939-e4115bead28a'
const PROJECT_STATUS_ABANDONED = 'abandoned'
const FDI_INVESTMENT_TYPE_ID = '3e143372-496c-4d1e-8278-6fdd3da9b48b'
const MEDIUM_LIKELIHOOD_TO_LAND_ID = '683ca57b-bd69-462c-852f-d2177e35b2eb'
const INVOLVEMENT_LEVEL_UNSPECIFIED = 'unspecified'

const getFinancialYearStart = () => {
  const now = new Date()
  return now.month < 3 ? now.getFullYear() - 1 : now.getFullYear()
}

const yearStartToRange = (yearStart) =>
  `${yearStart}-${(yearStart + 1).toString().slice(-2)}`

describe('Investments Collections Filter', () => {
  beforeEach(() => {
    cy.get('[data-test="stage-filter"]').as('stageFilter')
    cy.get('[data-test="my-projects-filter"]').as('myProjectsFilter')
    cy.get('[data-test="adviser-filter"]').as('adviserFilter')
    cy.get('[data-test="sector-filter"]').as('sectorFilter')
    cy.get('[data-test="country-filter"]').as('countryFilter')
    cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
    cy.get('[data-test="project-status-filter"]').as('projectStatusFilter')
    cy.get('[data-test="investment-type-filter"]').as('investmentTypeFilter')
    cy.get('[data-test="financial-year-filter"]').as('financialYearFilter')
    cy.get('[data-test="likelihood-to-land-filter"]').as(
      'likelihoodToLandFilter'
    )
    cy.get('[data-test="estimated-land-date-before-filter"]').as(
      'estimatedDateBeforeFilter'
    )
    cy.get('[data-test="estimated-land-date-after-filter"]').as(
      'estimatedDateAfterFilter'
    )
    cy.get('[data-test="actual-land-date-before-filter"]').as(
      'actualDateBeforeFilter'
    )
    cy.get('[data-test="actual-land-date-after-filter"]').as(
      'actualDateAfterFilter'
    )
    cy.get('[data-test="involvement-level-filter"]').as(
      'involvementLevelFilter'
    )
  })

  context('when the url contains no state', () => {
    before(() => {
      cy.visit(urls.investments.projects.index())
    })

    it('should contain filter fields in the right order', () => {
      const expectedIdentifiers = [
        'stage-filter',
        'my-projects-filter',
        'adviser-filter',
        'sector-filter',
        'country-filter',
        'uk-region-filter',
        'project-status-filter',
        'investment-type-filter',
        'financial-year-filter',
        'likelihood-to-land-filter',
        'estimated-land-date-before-filter',
        'estimated-land-date-after-filter',
        'actual-land-date-before-filter',
        'actual-land-date-after-filter',
        'involvement-level-filter',
      ]
      cy.get('[data-test="company-information-filters"]')
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
      assertChipExists({ label: 'Prospect', position: 1 })

      testRemoveChip({ element: '@stageFilter' })
    })

    it('should filter by my projects', () => {
      clickCheckboxGroupOption({
        element: '@myProjectsFilter',
        value: MY_ADVISER_ID,
      })
      assertCheckboxGroupOption({
        element: '@myProjectsFilter',
        value: MY_ADVISER_ID,
        checked: true,
      })
      cy.get('@adviserFilter').should('contain', 'Jimmy West')
      assertChipExists({ label: 'Jimmy West', position: 1 })

      testRemoveChip({ element: '@adviserFilter' })
    })

    it('should filter by advisers', () => {
      cy.get('@adviserFilter')
        .should('contain', 'Search adviser')
        .find('label')
        .should('have.text', 'Adviser')

      selectFirstAdvisersTypeaheadOption({
        element: '@adviserFilter',
        input: 'puc',
      })
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertChipExists({ label: 'Puck Head', position: 1 })

      testRemoveChip({
        element: '@adviserFilter',
        placeholder: 'Search adviser',
      })
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        label: 'Sector',
        placeholder: 'Search sector',
        input: 'adv',
        expectedOption: 'Advanced Engineering',
      })

      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sector',
      })
    })

    it('should filter by country', () => {
      testTypeahead({
        element: '@countryFilter',
        label: 'Country of origin',
        placeholder: 'Search country',
        input: 'sin',
        expectedOption: 'Singapore',
      })

      testRemoveChip({
        element: '@countryFilter',
        placeholder: 'Search country',
      })
    })

    it('should filter by uk region', () => {
      testTypeahead({
        element: '@ukRegionFilter',
        label: 'UK region',
        placeholder: 'Search UK region',
        input: 'sou',
        expectedOption: 'South East',
      })

      testRemoveChip({
        element: '@ukRegionFilter',
        placeholder: 'Search UK region',
      })
    })

    it('should filter by project status', () => {
      clickCheckboxGroupOption({
        element: '@projectStatusFilter',
        value: PROJECT_STATUS_ABANDONED,
      })
      assertCheckboxGroupOption({
        element: '@projectStatusFilter',
        value: PROJECT_STATUS_ABANDONED,
        checked: true,
      })
      assertChipExists({ label: 'Abandoned', position: 1 })

      testRemoveChip({ element: '@projectStatusFilter' })
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
      assertChipExists({ label: 'FDI', position: 1 })

      testRemoveChip({ element: '@investmentTypeFilter' })
    })

    it('should filter by likelihood to land', () => {
      clickCheckboxGroupOption({
        element: '@likelihoodToLandFilter',
        value: MEDIUM_LIKELIHOOD_TO_LAND_ID,
      })
      assertCheckboxGroupOption({
        element: '@likelihoodToLandFilter',
        value: MEDIUM_LIKELIHOOD_TO_LAND_ID,
        checked: true,
      })
      assertChipExists({ label: 'Likelihood to land: Medium', position: 1 })

      testRemoveChip({ element: '@investmentTypeFilter' })
    })

    it('should filter the estimated land date before', () => {
      cy.get('@estimatedDateBeforeFilter')
        .find('label')
        .should('have.text', 'Estimated land date before')
        .next()
        .click()
        .type('2020-01-01')
      assertChipExists({
        label: 'Estimated land date before: 1 January 2020',
        position: 1,
      })

      testRemoveChip({ element: '@estimatedDateBeforeFilter' })
    })

    it('should filter the estimated land date after', () => {
      cy.get('@estimatedDateAfterFilter')
        .find('label')
        .should('have.text', 'Estimated land date after')
        .next()
        .click()
        .type('2020-01-02')
      assertChipExists({
        label: 'Estimated land date after: 2 January 2020',
        position: 1,
      })

      testRemoveChip({ element: '@estimatedDateAfterFilter' })
    })

    it('should filter the actual land date before', () => {
      cy.get('@actualDateBeforeFilter')
        .find('label')
        .should('have.text', 'Actual land date before')
        .next()
        .click()
        .type('2020-02-01')
      assertChipExists({
        label: 'Actual land date before: 1 February 2020',
        position: 1,
      })

      testRemoveChip({ element: '@actualDateBeforeFilter' })
    })

    it('should filter the actual land date after', () => {
      cy.get('@actualDateAfterFilter')
        .find('label')
        .should('have.text', 'Actual land date after')
        .next()
        .click()
        .type('2020-02-02')
      assertChipExists({
        label: 'Actual land date after: 2 February 2020',
        position: 1,
      })

      testRemoveChip({ element: '@actualDateAfterFilter' })
    })

    it('should filter by financial year', () => {
      const yearStart = getFinancialYearStart()
      const yearRange = yearStartToRange(yearStart)

      clickCheckboxGroupOption({
        element: '@financialYearFilter',
        value: yearStart,
      })
      assertCheckboxGroupOption({
        element: '@financialYearFilter',
        value: yearStart,
        checked: true,
      })
      assertChipExists({
        label: `Current year ${yearRange}`,
        position: 1,
      })

      testRemoveChip({ element: '@financialYearFilter' })
    })

    it('should filter by involvement level', () => {
      clickCheckboxGroupOption({
        element: '@involvementLevelFilter',
        value: INVOLVEMENT_LEVEL_UNSPECIFIED,
      })
      assertCheckboxGroupOption({
        element: '@involvementLevelFilter',
        value: INVOLVEMENT_LEVEL_UNSPECIFIED,
        checked: true,
      })
      assertChipExists({
        label: 'Level of involvement specified: Unspecified',
        position: 1,
      })

      testRemoveChip({ element: '@involvementLevelFilter' })
    })
  })

  context('when the url contains state', () => {
    const financialYearStart = getFinancialYearStart()
    const financialYearRange = yearStartToRange(financialYearStart)

    before(() => {
      cy.visit(urls.investments.projects.index(), {
        qs: {
          stage: PROSPECT_STAGE_ID,
          adviser: MY_ADVISER_ID,
          sector_descends: ADVANCED_ENGINEERING_SECTOR_ID,
          country_investment_originates_from: UK_COUNTRY_ID,
          uk_region_location: SOUTH_EAST_UK_REGION_ID,
          status: PROJECT_STATUS_ABANDONED,
          investment_type: FDI_INVESTMENT_TYPE_ID,
          financial_year_start: financialYearStart,
          likelihood_to_land: MEDIUM_LIKELIHOOD_TO_LAND_ID,
          estimated_land_date_before: '2020-01-01',
          estimated_land_date_after: '2020-01-02',
          actual_land_date_before: '2020-02-01',
          actual_land_date_after: '2020-02-02',
          level_of_involvement_simplified: INVOLVEMENT_LEVEL_UNSPECIFIED,
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
      assertChipExists({ position: 2, label: 'Jimmy West' })
      assertCheckboxGroupOption({
        element: '@myProjectsFilter',
        value: MY_ADVISER_ID,
        checked: true,
      })
      cy.get('@adviserFilter').should('contain', 'Jimmy West')
      assertChipExists({ position: 3, label: 'Advanced Engineering' })
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      assertChipExists({ position: 4, label: 'United Kingdom' })
      cy.get('@countryFilter').should('contain', 'United Kingdom')
      assertChipExists({ position: 5, label: 'South East' })
      cy.get('@ukRegionFilter').should('contain', 'South East')
      assertChipExists({ position: 6, label: 'Abandoned' })
      assertCheckboxGroupOption({
        element: '@projectStatusFilter',
        value: PROJECT_STATUS_ABANDONED,
        checked: true,
      })
      assertChipExists({ position: 7, label: 'FDI' })
      assertCheckboxGroupOption({
        element: '@investmentTypeFilter',
        value: FDI_INVESTMENT_TYPE_ID,
        checked: true,
      })
      assertChipExists({ position: 8, label: 'Likelihood to land: Medium' })
      assertCheckboxGroupOption({
        element: '@likelihoodToLandFilter',
        value: MEDIUM_LIKELIHOOD_TO_LAND_ID,
        checked: true,
      })
      assertChipExists({
        label: 'Estimated land date before: 1 January 2020',
        position: 9,
      })
      cy.get('@estimatedDateBeforeFilter')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
      assertChipExists({
        label: 'Estimated land date after: 2 January 2020',
        position: 10,
      })
      cy.get('@estimatedDateAfterFilter')
        .find('input')
        .should('have.attr', 'value', '2020-01-02')
      assertChipExists({
        label: 'Actual land date before: 1 February 2020',
        position: 11,
      })
      cy.get('@actualDateBeforeFilter')
        .find('input')
        .should('have.attr', 'value', '2020-02-01')
      assertChipExists({
        label: 'Actual land date after: 2 February 2020',
        position: 12,
      })
      cy.get('@actualDateAfterFilter')
        .find('input')
        .should('have.attr', 'value', '2020-02-02')
      assertChipExists({
        position: 13,
        label: 'Level of involvement specified: Unspecified',
      })
      assertCheckboxGroupOption({
        element: '@involvementLevelFilter',
        value: INVOLVEMENT_LEVEL_UNSPECIFIED,
        checked: true,
      })
      assertChipExists({
        position: 14,
        label: `Current year ${financialYearRange}`,
      })
      assertCheckboxGroupOption({
        element: '@financialYearFilter',
        value: financialYearStart,
        checked: true,
      })
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 14)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)
      cy.get('@estimatedDateBeforeFilter')
        .find('input')
        .should('have.attr', 'value', '')
      cy.get('@estimatedDateBeforeFilter')
        .find('input')
        .should('have.attr', 'value', '')
      cy.get('@adviserFilter').should('contain', 'Search adviser')
      cy.get('@sectorFilter').should('contain', 'Search sector')
      cy.get('@countryFilter').should('contain', 'Search country')
      cy.get('@ukRegionFilter').should('contain', 'Search UK region')
      assertCheckboxGroupNoneSelected('@stageFilter')
      assertCheckboxGroupNoneSelected('@myProjectsFilter')
      assertCheckboxGroupNoneSelected('@projectStatusFilter')
      assertCheckboxGroupNoneSelected('@investmentTypeFilter')
      assertCheckboxGroupNoneSelected('@likelihoodToLandFilter')
      assertCheckboxGroupNoneSelected('@involvementLevelFilter')
      assertCheckboxGroupNoneSelected('@financialYearFilter')
    })
  })
})
