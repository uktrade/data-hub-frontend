export const fillAddAnother = (
  addButtonSelector,
  AddAnotherDataTestPrefix,
  dataArray
) => {
  if (dataArray) {
    const max = dataArray.length - 1
    dataArray.map((item, index) => {
      if (index < max) clickAddAnotherButton(addButtonSelector)
      fillTypeahead(`[data-test=${AddAnotherDataTestPrefix}${index}]`, item)
    })
  }
}

export const fill = (selector, value) => {
  if (selector && value) {
    cy.get(selector).type(value)
  }
}

export const fillYesNoRadio = (selector, isYes) => {
  if (isYes === true) {
    cy.get(selector).eq(0).click()
  } else if (isYes === false) {
    cy.get(selector).eq(1).click()
  }
}

export const fillTypeahead = (selector, value) => {
  cy.get(selector).selectTypeaheadOption(value)
}

export const fillDate = (dateId, day, month, year) => {
  cy.get(`${dateId}\\.day`).type(day)
  cy.get(`${dateId}\\.month`).type(month)
  cy.get(`${dateId}\\.year`).type(year)
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
