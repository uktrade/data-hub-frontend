/**
 * @deprecated
 * THE LOGIC IN THIS FILE HAS BEEN MOVED TO THE /test/support FOLDER AS THE LOGIC IS SHARED BETWEEN
 *  THE COMPONENT AND FUNCTIONAL TESTS. THIS FILE IS ONLY HERE TO AVOID BREAKING ANY TESTS, NO
 * ADDITIONAL LOGIC SHOULD BE ADDED
 */

/**
 * @deprecated
 */
export const fill = (selector, value) => {
  if (selector && value) {
    cy.get(selector).type(value)
  }
}

/**
 * @deprecated
 * This function first clears the input before typing the new value
 */
export const fillWithNewValue = (selector, value) => {
  if (selector && value) {
    cy.get(selector).clear().type(value)
  }
}

/*
 * @deprecated
 */
export const fillYesNoRadio = (selector, isYes) => {
  cy.get(selector)
    .eq(isYes === true ? 0 : 1)
    .click()
}

/**
 * @deprecated
 */
export const fillTypeahead = (selector, value) => {
  cy.get(selector).selectTypeaheadOption(value)
}

/**
 * @deprecated
 */
export const fillTypeaheadWithLegend = (selector, value) => {
  cy.get(selector).children().selectTypeaheadOption(value)
}

/**
 * @deprecated
 */
export const fillMultiOptionTypeahead = (selector, values = []) => {
  values.map((value) => fillTypeahead(selector, value))
}

/**
 * @deprecated
 */
export const fillMultiOptionTypeaheadWithLegend = (selector, values = []) => {
  values.map((value) => fillTypeaheadWithLegend(selector, value))
}

/**
 * @deprecated
 */
export const fillDate = (dateId, day, month, year) => {
  cy.get(`${dateId}\\.day`).type(day)
  cy.get(`${dateId}\\.month`).type(month)
  cy.get(`${dateId}\\.year`).type(year)
}

/**
 * @deprecated
 */
export const fillSelect = (selector, value) => {
  cy.get(selector).find('select').should('not.be.disabled').select(value)
}

/**
 * @deprecated
 */
export const clearTypeahead = (selector) => {
  cy.get(selector).find('input').clear().type('{esc}')
}

//  Click events
/**
 * @deprecated
 */
export const clickAddAnotherButton = (selector) => {
  cy.get(selector).find('button').click()
}

/**
 * @deprecated
 */
export const clickSaveAndReturnButton = () => {
  cy.contains('button', 'Save and return').click()
}

/**
 * @deprecated
 */
export const clickReturnWithoutSavingButton = () => {
  cy.contains('Return without saving').click()
}
