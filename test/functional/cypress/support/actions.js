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
    cy.get('div').eq(0).type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

/**
 * Clicks the checkbox option with the given value
 */
export const clickCheckboxGroupOption = ({ element, value }) => {
  cy.get(element).find(`input[value="${value}"]`).click()
}

/**
 * Enter `input` into a typeahead `element` and select the first result
 */
export const selectFirstTypeaheadOption = ({ element, input }) => {
  cy.get(element).type(input)
  cy.get(element).find('[class*="menu"] > div').click()
  cy.get(element).click()
}
