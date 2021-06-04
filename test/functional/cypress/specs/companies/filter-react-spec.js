import { companies } from '../../../../../src/lib/urls'

import { clickCheckboxGroupOption } from '../../support/actions'
import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
} from '../../support/assertions'
import { testTypeahead, testRemoveChip } from '../../support/tests'

const GLOBAL_HQ_ID = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const TEST_COMPANY_NAME_QUERY = 'Test Company'

describe('Investments Collections Filter', () => {
  context('when the url contains no state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index())
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
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
      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
      assertChipExists({ label: 'Global HQ', position: 1 })

      testRemoveChip({ element: '@hqTypeFilter' })
    })

    it('should filter by Company Name', () => {
      cy.get('@companyNameFilter')
        .type(`${TEST_COMPANY_NAME_QUERY}{enter}`)
        .blur()

      cy.get('@companyNameFilter').should('have.value', TEST_COMPANY_NAME_QUERY)
      assertChipExists({ label: 'Test Company', position: 1 })

      testRemoveChip({ element: '@companyNameFilter' })
      cy.get('@companyNameFilter').should('have.value', '')
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        legend: 'Sector',
        placeholder: 'Search sectors',
        input: 'adv',
        expectedOption: 'Advanced Engineering',
      })

      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sectors',
      })
    })
  })

  context('when the url contains state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index(), {
        qs: {
          headquarter_type: GLOBAL_HQ_ID,
          name: TEST_COMPANY_NAME_QUERY,
          sector_descends: ADVANCED_ENGINEERING_SECTOR_ID,
        },
      })
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
      cy.get('[data-test="company-name-filter"]').as('companyNameFilter')
      cy.get('[data-test="sector-filter"]').as('sectorFilter')
    })

    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: 'Advanced Engineering' })
      assertChipExists({ position: 2, label: 'Global HQ' })
      assertChipExists({ position: 3, label: TEST_COMPANY_NAME_QUERY })
      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
      cy.get('@companyNameFilter').should('have.value', TEST_COMPANY_NAME_QUERY)
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 3)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)

      assertCheckboxGroupNoneSelected('@hqTypeFilter')
      cy.get('@companyNameFilter').should('have.value', '')
      cy.get('@sectorFilter').should('contain', 'Search sectors')
    })
  })
})
