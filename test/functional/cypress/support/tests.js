import { selectFirstTypeaheadOption } from './actions'
import {
  assertTypeaheadHints,
  assertTypeaheadOptionSelected,
  assertCheckboxGroupOption,
} from './assertions'

/**
 * @deprecated
 * THE LOGIC IN THIS FILE HAS BEEN MOVED TO THE /test/support FOLDER AS THE LOGIC IS SHARED BETWEEN
 *  THE COMPONENT AND FUNCTIONAL TESTS. THIS FILE IS ONLY HERE TO AVOID BREAKING ANY TESTS, NO
 * ADDITIONAL LOGIC SHOULD BE ADDED
 */

/**
 * @deprecated
 * Tests that a typeahead functions correctly by inputing a value and selecting
 */
export const testTypeahead = ({
  element,
  legend,
  placeholder,
  input,
  expectedOption,
  label,
}) => {
  assertTypeaheadHints({ element, legend, label, placeholder })
  selectFirstTypeaheadOption({ element, input })
  assertTypeaheadOptionSelected({ element, expectedOption })
}

/**
 * @deprecated
 * Test that a typeahead has the correct number of options
 */
export const testTypeaheadOptionsLength = ({ element, length }) => {
  cy.get(element)
    .click()
    .find('[data-test="typeahead-menu-option"]')
    .should('have.length', length)
}

/**
 * @deprecated
 * Tests that clicking the first indicator button clears a filter element
 */
export const testRemoveChip = ({ element, placeholder = null }) => {
  cy.get('#filter-chips')
    .as('filterChips')
    .find('button')
    .click({ multiple: true })
  cy.get('@filterChips').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}

/**
 * @deprecated
 * Tests that finding the checkbox option matching the value and clicking it will mark that option as selected
 */
export const testCheckBoxGroup = ({ element, value, checked = true }) => {
  const checkbox = cy.get(element).find(`input[value="${value}"]`)
  checkbox.first().click()

  assertCheckboxGroupOption({ element, value, checked })
}
