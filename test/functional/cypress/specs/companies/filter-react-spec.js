import { companies } from '../../../../../src/lib/urls'

import {
  clickCheckboxGroupOption,
  selectFirstAdvisersTypeaheadOption,
} from '../../support/actions'
import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
} from '../../support/assertions'
import { testTypeahead, testRemoveChip } from '../../support/tests'

const GLOBAL_HQ_ID = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
const EUROPEAN_HQ_ID = 'eb59eaeb-eeb8-4f54-9506-a5e08773046b'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const TEST_COMPANY_NAME_QUERY = 'Test Company'
const TEST_POSTCODE_ONE = 'AB1 2CD'
const TEST_POSTCODE_TWO = 'EF3 4GH'
const TEST_POSTCODE_QUERY = `${TEST_POSTCODE_ONE}, ${TEST_POSTCODE_TWO}`
const UK_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const SOUTH_EAST_UK_REGION_ID = '884cd12a-6095-e211-a939-e4115bead28a'
const ADVISER_ID = '7d19d407-9aec-4d06-b190-d3f404627f21'
const ADVISER_NAME = 'Jimmy West'

describe('Investments Collections Filter', () => {
  context('when the url contains no state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index())
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
      cy.get('[data-test="country-filter"]').as('countryFilter')
      cy.get('[data-test="uk-postcode-filter"]').as('ukPostcodeFilter')
      cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
      cy.get('[data-test="company-status-filter"]').as('statusFilter')
      cy.get('[data-test="currently-exporting-to-country-filter"]').as(
        'currentlyExportingToFilter'
      )
      cy.get('[data-test="future-countries-of-interest-filter"]').as(
        'futureCountriesOfInterestFilter'
      )
      cy.get('[data-test="lead-ita-global-account-manager-filter"]').as(
        'leadItaGlobalAccountManagerFilter'
      )
      cy.intercept('POST', '/api-proxy/v4/search/company').as('apiRequest')
    })

    it('should filter by Headquarter Type', () => {
      cy.get('@hqTypeFilter')
        .find('label')
        .as('hqTypeOptions')
        .should('have.length', 3)
      cy.get('@hqTypeOptions').eq(0).should('contain', 'European HQ')
      cy.get('@hqTypeOptions').eq(1).should('contain', 'Global HQ')
      cy.get('@hqTypeOptions').eq(2).should('contain', 'UK HQ')
      clickCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
      })

      cy.wait('@apiRequest')
        .its('request.body.headquarter_type')
        .should('include', GLOBAL_HQ_ID)

      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
      assertChipExists({ label: 'Global HQ', position: 1 })

      clickCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: EUROPEAN_HQ_ID,
      })
      cy.wait('@apiRequest')
        .its('request.body.headquarter_type')
        .should('include', GLOBAL_HQ_ID)
        .should('include', EUROPEAN_HQ_ID)

      assertChipExists({ label: 'European HQ', position: 1 })
      assertChipExists({ label: 'Global HQ', position: 2 })

      testRemoveChip({ element: '@hqTypeFilter' })
    })

    it('should filter by Company Name', () => {
      cy.get('@companyNameFilter')
        .type(`${TEST_COMPANY_NAME_QUERY}{enter}`)
        .blur()

      cy.wait('@apiRequest')
        .its('request.body.name')
        .should('include', TEST_COMPANY_NAME_QUERY)

      cy.get('@companyNameFilter').should('have.value', TEST_COMPANY_NAME_QUERY)
      assertChipExists({ label: TEST_COMPANY_NAME_QUERY, position: 1 })

      testRemoveChip({ element: '@companyNameFilter' })
      cy.get('@companyNameFilter').should('have.value', '')
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        legend: 'Sector',
        placeholder: 'Search sector',
        input: 'adv',
        expectedOption: 'Advanced Engineering',
      })

      cy.wait('@apiRequest')
        .its('request.body.sector_descends')
        .should('include', ADVANCED_ENGINEERING_SECTOR_ID)

      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sector',
      })
    })

    it('should filter by country', () => {
      testTypeahead({
        element: '@countryFilter',
        legend: 'Country',
        placeholder: 'Search country',
        input: 'united k',
        expectedOption: 'United Kingdom',
      })

      cy.wait('@apiRequest')
        .its('request.body.country')
        .should('include', UK_COUNTRY_ID)

      testRemoveChip({
        element: '@countryFilter',
        placeholder: 'Search country',
      })
    })

    it('should filter by UK Postcode', () => {
      cy.get('@ukPostcodeFilter').type(`${TEST_POSTCODE_QUERY}{enter}`).blur()

      cy.wait('@apiRequest')
        .its('request.body.uk_postcode')
        .should('have.length', 2)
        .should('deep.equal', [TEST_POSTCODE_ONE, TEST_POSTCODE_TWO])

      cy.get('@ukPostcodeFilter').should('have.value', TEST_POSTCODE_QUERY)
      assertChipExists({ label: TEST_POSTCODE_QUERY, position: 1 })

      testRemoveChip({ element: '@ukPostcodeFilter' })
      cy.get('@ukPostcodeFilter').should('have.value', '')
    })

    it('should filter by UK region', () => {
      testTypeahead({
        element: '@ukRegionFilter',
        legend: 'UK region',
        placeholder: 'Search UK region',
        input: 'south e',
        expectedOption: 'South East',
      })

      cy.wait('@apiRequest')
        .its('request.body.uk_region')
        .should('include', SOUTH_EAST_UK_REGION_ID)

      testRemoveChip({
        element: '@ukRegionFilter',
        placeholder: 'Search UK region',
      })
    })

    it('should filter by status', () => {
      cy.get('@statusFilter')
        .find('label')
        .as('statusOptions')
        .should('have.length', 2)
      cy.get('@statusOptions')
        .eq(0)
        .should('contain', 'Active')
        .find('input')
        .should('have.value', 'false')
      cy.get('@statusOptions')
        .eq(1)
        .should('contain', 'Inactive')
        .find('input')
        .should('have.value', 'true')
      clickCheckboxGroupOption({
        element: '@statusFilter',
        value: 'false',
      })

      cy.wait('@apiRequest').its('request.body.archived').should('equal', false)

      clickCheckboxGroupOption({
        element: '@statusFilter',
        value: 'true',
      })

      cy.wait('@apiRequest')
        .its('request.body.archived')
        .should('equal', undefined)

      assertCheckboxGroupOption({
        element: '@statusFilter',
        value: 'false',
        checked: true,
      })
      assertChipExists({ label: 'Active', position: 1 })

      testRemoveChip({ element: '@statusFilter' })
    })

    it('should filter by currently exporting to country', () => {
      testTypeahead({
        element: '@currentlyExportingToFilter',
        legend: 'Currently exporting to',
        placeholder: 'Search country',
        input: 'united k',
        expectedOption: 'United Kingdom',
      })

      cy.wait('@apiRequest')
        .its('request.body.export_to_countries')
        .should('include', UK_COUNTRY_ID)

      testRemoveChip({
        element: '@currentlyExportingToFilter',
        placeholder: 'Search country',
      })
    })

    it('should filter by future countries of interest', () => {
      testTypeahead({
        element: '@futureCountriesOfInterestFilter',
        legend: 'Future countries of interest',
        placeholder: 'Search country',
        input: 'united k',
        expectedOption: 'United Kingdom',
      })

      cy.wait('@apiRequest')
        .its('request.body.future_interest_countries')
        .should('include', UK_COUNTRY_ID)

      testRemoveChip({
        element: '@futureCountriesOfInterestFilter',
        placeholder: 'Search country',
      })
    })

    it('should filter by lead ITA or Global Account Manager', () => {
      cy.get('@leadItaGlobalAccountManagerFilter')
        .should('contain', 'Search adviser')
        .find('legend')
        .should('have.text', 'Lead ITA or Global Account Manager')

      selectFirstAdvisersTypeaheadOption({
        element: '@leadItaGlobalAccountManagerFilter',
        input: 'puc',
      })
      cy.get('@leadItaGlobalAccountManagerFilter').should(
        'contain',
        'Puck Head'
      )
      assertChipExists({ label: 'Puck Head', position: 1 })

      testRemoveChip({
        element: '@leadItaGlobalAccountManagerFilter',
        placeholder: 'Search adviser',
      })
    })
  })

  context('when the url contains state', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v4/search/company').as(
        'initialApiRequest'
      )
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index(), {
        qs: {
          headquarter_type: GLOBAL_HQ_ID,
          name: TEST_COMPANY_NAME_QUERY,
          sector_descends: ADVANCED_ENGINEERING_SECTOR_ID,
          uk_postcode: TEST_POSTCODE_QUERY,
          uk_region: SOUTH_EAST_UK_REGION_ID,
          archived: ['true'],
          country: UK_COUNTRY_ID,
          export_to_countries: UK_COUNTRY_ID,
          future_interest_countries: UK_COUNTRY_ID,
          one_list_group_global_account_manager: ADVISER_ID,
        },
      })
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
      cy.get('[data-test="country-filter"]').as('countryFilter')
      cy.get('[data-test="uk-postcode-filter"]').as('ukPostcodeFilter')
      cy.get('[data-test="uk-region-filter"]').as('ukRegionFilter')
      cy.get('[data-test="company-status-filter"]').as('statusFilter')
      cy.get('[data-test="currently-exporting-to-country-filter"]').as(
        'currentlyExportingToFilter'
      )
      cy.get('[data-test="future-countries-of-interest-filter"]').as(
        'futureCountriesOfInterestFilter'
      )
      cy.get('[data-test="lead-ita-global-account-manager-filter"]').as(
        'leadItaGlobalAccountManagerFilter'
      )
      cy.intercept('POST', '/api-proxy/v4/search/company').as('apiRequest')
    })

    it('should fetch companies with the given filters', () => {
      cy.wait('@initialApiRequest').then(({ request }) => {
        const { body } = request
        expect(body.headquarter_type).to.equal(GLOBAL_HQ_ID)
        expect(body.name).to.equal(TEST_COMPANY_NAME_QUERY)
        expect(body.sector_descends).to.equal(ADVANCED_ENGINEERING_SECTOR_ID)
        expect(body.country).to.equal(UK_COUNTRY_ID)
        expect(body.uk_postcode).to.deep.equal([
          TEST_POSTCODE_ONE,
          TEST_POSTCODE_TWO,
        ])
        expect(body.uk_region).to.equal(SOUTH_EAST_UK_REGION_ID)
        expect(body.archived).to.be.true
        expect(body.export_to_countries).to.equal(UK_COUNTRY_ID)
        expect(body.future_interest_countries).to.equal(UK_COUNTRY_ID)
        expect(body.one_list_group_global_account_manager).to.equal(ADVISER_ID)
      })
    })

    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: 'Advanced Engineering' })
      assertChipExists({ position: 2, label: 'United Kingdom' })
      assertChipExists({
        position: 3,
        label: 'Currently exporting to: United Kingdom',
      })
      assertChipExists({
        position: 4,
        label: 'Future countries of interest: United Kingdom',
      })
      assertChipExists({ position: 5, label: TEST_POSTCODE_QUERY })
      assertChipExists({ position: 6, label: 'South East' })
      assertChipExists({ position: 7, label: 'Global HQ' })
      assertChipExists({ position: 8, label: TEST_COMPANY_NAME_QUERY })
      assertChipExists({ position: 9, label: 'Inactive' })
      assertChipExists({
        position: 10,
        label: `Lead ITA or Global Account Manager: ${ADVISER_NAME}`,
      })
      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
      cy.get('@companyNameFilter').should('have.value', TEST_COMPANY_NAME_QUERY)
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      cy.get('@ukPostcodeFilter').should('have.value', TEST_POSTCODE_QUERY)
      cy.get('@countryFilter').should('contain', 'United Kingdom')
      cy.get('@ukRegionFilter').should('contain', 'South East')
      assertCheckboxGroupOption({
        element: '@statusFilter',
        value: 'true',
        checked: true,
      })
      cy.get('@currentlyExportingToFilter').should('contain', 'United Kingdom')
      cy.get('@futureCountriesOfInterestFilter').should(
        'contain',
        'United Kingdom'
      )
      cy.get('@leadItaGlobalAccountManagerFilter').should(
        'contain',
        ADVISER_NAME
      )
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 10)
      cy.get('@clearFilters').click()

      cy.wait('@apiRequest').then(({ request }) => {
        const { body } = request
        expect(body.headquarter_type).to.equal(undefined)
        expect(body.name).to.equal(undefined)
        expect(body.sector_descends).to.equal(undefined)
        expect(body.country).to.equal(undefined)
        expect(body.uk_postcode).to.equal(undefined)
        expect(body.uk_region).to.equal(undefined)
        expect(body.archived).to.equal(undefined)
        expect(body.export_to_countries).to.equal(undefined)
        expect(body.future_interest_countries).to.equal(undefined)
        expect(body.one_list_group_global_account_manager).to.equal(undefined)
      })

      cy.get('@chips').should('have.length', 0)

      assertCheckboxGroupNoneSelected('@hqTypeFilter')
      cy.get('@companyNameFilter').should('have.value', '')
      cy.get('@sectorFilter').should('contain', 'Search sector')
      cy.get('@countryFilter').should('contain', 'Search country')
      cy.get('@ukPostcodeFilter').should('have.value', '')
      cy.get('@ukRegionFilter').should('contain', 'Search UK region')
      assertCheckboxGroupNoneSelected('@statusFilter')
      cy.get('@currentlyExportingToFilter').should('contain', 'Search country')
      cy.get('@futureCountriesOfInterestFilter').should(
        'contain',
        'Search country'
      )
      cy.get('@leadItaGlobalAccountManagerFilter').should(
        'contain',
        'Search adviser'
      )
    })
  })
})
