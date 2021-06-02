import { companies } from '../../../../../src/lib/urls'

import {
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertChipExists,
} from '../../support/assertions'
import { clickCheckboxGroupOption } from '../../support/actions'

const GLOBAL_HQ_ID = '43281c5e-92a4-4794-867b-b4d5f801e6f3'

/**
 * Tests that clicking the first indicator button clears a filter element
 */
const testRemoveChip = ({ element, placeholder = null }) => {
  cy.get('#filter-chips').as('filterChips').find('button').click()
  cy.get('@filterChips').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}

describe('Investments Collections Filter', () => {
  context('when the url contains no state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index())
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
    })

    it('should filter by Headquarter Type', () => {
      cy.get('@hqTypeFilter')
        .find('label')
        .as('hqTypeOptions')
        .should('have.length', 3)
      cy.get('@hqTypeOptions').eq(0).should('contain', 'Global HQ')
      cy.get('@hqTypeOptions').eq(1).should('contain', 'European HQ')
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
  })

  context('when the url contains state', () => {
    beforeEach(() => {
      // Visit the new react companies page - note this will need to be changed
      // to `companies.index()` when ready
      cy.visit(companies.react.index(), {
        qs: {
          headquarter_type: GLOBAL_HQ_ID,
        },
      })
      cy.get('[data-test="headquarter-type-filter"]').as('hqTypeFilter')
    })

    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: 'Global HQ' })
      assertCheckboxGroupOption({
        element: '@hqTypeFilter',
        value: GLOBAL_HQ_ID,
        checked: true,
      })
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 1)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)
      assertCheckboxGroupNoneSelected('@hqTypeFilter')
    })
  })
})
