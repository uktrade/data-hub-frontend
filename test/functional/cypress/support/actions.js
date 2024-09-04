import { fill } from './form-fillers'

const adviserResult = require('../../../sandbox/fixtures/autocomplete-adviser-list.json')

/**
 * Enter `input` into a typeahead `element` and select the first result.
 *
 * Defaults to Typeahead for adviser but can changed to any type by setting
 * optional url and bodyResult parameters.
 *
 * This waits for the [adviser] api request to complete before selecting the
 * first option, but has a mocked intercepted [adviser] response to circumvent
 * network latency.
 */
export const selectFirstMockedTypeaheadOption = ({
  element,
  input,
  mockAdviserResponse = true,
  url = `/api-proxy/adviser/?*`,
  bodyResult = adviserResult,
}) =>
  cy.get(element).within(() => {
    cy.intercept(
      url + `${input.replace(' ', '+')}*`,
      mockAdviserResponse
        ? {
            body: bodyResult,
          }
        : undefined
    ).as('adviserResults')
    cy.get('input').clear().type(input)
    cy.wait('@adviserResults')
    cy.get('[data-test="typeahead-menu-option"]').contains(input, {
      matchCase: false,
      timeout: 120000,
    })
    cy.get('input').type('{downarrow}{enter}{esc}')
  })

/**
 * Clicks the checkbox option with the given value
 */
export const clickCheckboxGroupOption = ({ element, value }) => {
  cy.get(element).find(`input[value="${value}"]`).parent().click()
}

/**
 * Clicks the radiogroup option with the label
 */
export const clickRadioGroupOption = ({ element, label }) => {
  cy.get(element).contains('span', label).parent().click()
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

/**
 * Adds a date to the any given date input field that also has a hint
 */
export const inputDateValueWithHint = ({ element, value }) => {
  cy.get(element).find('fieldset > input').type(value)
}

/**
 * Adds a date object of {day, month, year} to the relevent input fields
 */
export const clearAndInputDateValueObject = ({ element, value }) => {
  cy.wrap(element).then(($el) => {
    cy.wrap($el).find('[data-test$="-day"]').clear().type(value.day.toString())
    cy.wrap($el)
      .find('[data-test$="-month"]')
      .clear()
      .type(value.month.toString())
    cy.wrap($el)
      .find('[data-test$="-year"]')
      .clear()
      .type(value.year.toString())
  })
}

/**
 * Clears and Types a value in an input field
 */
export const clearAndTypeInput = ({ element, value }) => {
  cy.wrap(element).then(($el) => {
    cy.wrap($el)
      .find('input')
      .clear()
      .type(value ?? '')
  })
}

/**
 * Clears and Types a value in an textarea field
 */
export const clearAndTypeTextArea = ({ element, value }) => {
  cy.wrap(element).then(($el) => {
    cy.wrap($el)
      .find('textarea')
      .clear()
      .type(value ?? '')
  })
}

/**
 * Remove the first item in a multi-select Typeahead
 */
export const removeFirstTypeaheadItem = () => {
  cy.get('[data-test="typeahead-chip"]').eq(0).click()
}

/**
 * Click on a button
 * @param {*} buttonText The text of the button you want to click
 */
export const clickButton = (buttonText) => {
  cy.contains('button', buttonText).click()
}

/**
 * Click on a Cancel anchor
 */
export const clickCancelLink = () => {
  cy.get('[data-test="cancel-button"]').click()
}

/**
 * Click on a Continue button
 */
export const clickContinueButton = () => {
  cy.get('[data-test="continue"]').click()
}

/**
 * Click on a Submit button
 */
export const clickSubmitButton = () => {
  cy.get('[data-test="submit"]').click()
}

/**
 * Generic search request for a CollectionList
 * @param {*} endpoint The search endpoint
 * @param {*} fakeList The fake list of items to display
 * @param {*} link The page to render
 */
export const collectionListRequest = (endpoint, fakeList, link) => {
  const fullEndpoint = '/api-proxy/' + endpoint
  cy.intercept('POST', fullEndpoint, {
    body: {
      count: fakeList.length,
      results: fakeList,
    },
  }).as('apiRequest')
  cy.visit(link)
  cy.wait('@apiRequest')
}

/**
 * Company Activity request for a CollectionList
 * @param {*} endpoint The search endpoint
 * @param {*} fakeList The fake list of items to display
 * @param {*} link The page to render
 */
export const companyActivityCollectionListRequest = (
  endpoint,
  fakeList,
  link
) => {
  const fullEndpoint = '/api-proxy/' + endpoint
  cy.intercept('POST', fullEndpoint, fakeList).as('apiRequest')
  cy.visit(link)
  cy.wait('@apiRequest')
}

export const omisCollectionListRequest = (
  endpoint,
  fakeList,
  link,
  subtotalCost = 23218.0
) => {
  const fullEndpoint = '/api-proxy/' + endpoint
  cy.intercept('POST', fullEndpoint, {
    body: {
      count: fakeList.length,
      results: fakeList,
      summary: {
        total_subtotal_cost: subtotalCost,
      },
    },
  }).as('apiRequest')
  cy.visit(link)
  cy.wait('@apiRequest')
}

export const addNewContact = (contact) => {
  fill('[data-test=group-field-first_name]', contact.first_name)
  fill('[data-test=group-field-last_name]', contact.last_name)
  fill('[data-test=job-title-input]', contact.job_title)
  fill('[data-test=job-title-input]', contact.job_title)
  fill('[data-test=email-input]', contact.email)
  cy.get('[name="addressSameAsCompany"]').check('Yes')
  cy.get('[name="primary"]').check('No')
  cy.get('[data-test="submit-button"').click()
}
