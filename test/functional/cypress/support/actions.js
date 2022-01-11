/**
 * Enter `input` into an advisers typeahead `element` and select the first result
 *
 * This waits for the adviser api request to complete before selecting the
 * first option.
 */
export const selectFirstAdvisersTypeaheadOption = ({ element, input }) =>
  cy.get(element).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('input').type(input)
    cy.wait('@adviserResults')
    cy.get('input').type('{downarrow}{enter}{esc}')
  })

/**
 * Clicks the checkbox option with the given value
 */
export const clickCheckboxGroupOption = ({ element, value }) => {
  cy.get(element).find(`input[value="${value}"]`).parent().click()
}

/**
 * Enter `input` into a typeahead `element` and select the first result
 */
export const selectFirstTypeaheadOption = ({ element, input }) => {
  cy.get(element).type(input)
  cy.get(element).find('[data-test="typeahead-menu-option"]').first().click()
  cy.get(element).find('input').blur()
}

/**
 * Removes a specific chip based on the data-value
 */
export const removeChip = (dataValue) => {
  cy.get('[data-test=filter-chips]').find(`[data-value="${dataValue}"]`).click()
}

/**
 * Adds a date to the any given date input field
 */
export const inputDateValue = ({ element, value }) => {
  cy.get(element).type(value)
}
