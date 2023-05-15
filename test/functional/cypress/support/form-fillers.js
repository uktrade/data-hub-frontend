export const fill = (selector, value) => {
  if (selector && value) {
    cy.get(selector).type(value)
  }
}

export const fillYesNoRadio = (selector, isYes) => {
  cy.get(selector)
    .eq(isYes === true ? 0 : 1)
    .click()
}

export const fillTypeahead = (selector, value) => {
  cy.get(selector).selectTypeaheadOption(value)
}

export const fillTypeaheadWithLegend = (selector, value) => {
  cy.get(selector).children().selectTypeaheadOption(value)
}

export const fillMultiOptionTypeahead = (selector, values = []) => {
  values.map((value) => fillTypeahead(selector, value))
}

export const fillMultiOptionTypeaheadWithLegend = (selector, values = []) => {
  values.map((value) => fillTypeaheadWithLegend(selector, value))
}

export const fillDate = (dateId, day, month, year) => {
  cy.get(`${dateId}\\.day`).type(day)
  cy.get(`${dateId}\\.month`).type(month)
  cy.get(`${dateId}\\.year`).type(year)
}

export const fillSelect = (selector, value) => {
  cy.get(selector).find('select').should('not.be.disabled').select(value)
}

export const clearTypeahead = (selector) => {
  cy.get(selector).find('input').clear().type('{esc}')
}

//  Click events

export const clickAddAnotherButton = (selector) => {
  cy.get(selector).find('button').click()
}

export const clickSaveAndReturnButton = () => {
  cy.contains('button', 'Save and return').click()
}

export const clickReturnWithoutSavingButton = () => {
  cy.contains('Return without saving').click()
}
