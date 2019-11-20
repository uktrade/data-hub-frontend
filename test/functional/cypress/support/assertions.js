const { keys, forEach } = require('lodash')

const selectors = require('../../../selectors')

const assertKeyValueTable = (dataAutoId, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1

    if (expected[key] === null) {
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should('have.text', key)
    } else if (expected[key].href) {
      cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should('have.text', key)
      cy.get(selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)).should('have.attr', 'href', expected[key].href)
      cy.get(selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)).should('have.text', expected[key].name)
    } else {
      cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should('have.text', key)
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should('have.text', expected[key])
    }
  })
}

const assertValueTable = (dataAutoId, expected) => {
  forEach(expected, (expectedValue, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should('have.text', expectedValue)
  })
}

/**
 * @description Asserts the presence of breadcrumbs with minimal knowledge about
 * implementation details e.g. class names and ids.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 * @example
 * // Asserts that breadcrumbs: Home > Foo > Bar > Baz exist and that they have
 * // the expected texts and hrefs.
 * it('Should render foo > bar > baz breadcrumbs' =>
 *   assertBreadcrumbs({
 *     'Home': '/',
 *     'Foo': '/foo',
 *     'Bar': '/bar',
 *     'Baz': undefined,
 *   })
 * )
 */
const assertBreadcrumbs = specs => {
  const entries = Object.entries(specs)
  cy
    .contains(Object.keys(specs).join(''))
    .children('li')
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedText, expectedHref] = entries[i]
      cy
        .get(x)
        .contains(expectedText)
        .invoke('attr', 'href')
        .should('eq', expectedHref || undefined)
    })
}

/**
 * @description Same as asserBreadcrumbs but already wrapped in an `it` block.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 */
const testBreadcrumbs = specs =>
  it('Should render breadcrumbs', () =>
    assertBreadcrumbs(specs)
  )

const assertFieldInput = ({ name, label = null, value = null }) => {
  const inputElement = cy.get(`input[name="${name}"]`)
  inputElement.should('be.visible')

  if (label) {
    const labelElement = cy.get(`label[for="${name}"]`)
    labelElement.should('have.text', label)
  }

  if (value) {
    inputElement.should('have.value', value)
  }
}

const assertFieldUneditable = ({ name, label = null, value = null }) => {
  let fieldWrapperElement

  fieldWrapperElement = cy.get(`label[for="${name}"]`).parent()
  fieldWrapperElement.should('be.visible')

  if (label) {
    const labelElement = fieldWrapperElement.find('label')
    labelElement.should('have.text', label)
  }

  if (value) {
    fieldWrapperElement.should('contain', value)
  }
}

const assertLocalHeader = (header) => {
  cy.get(selectors.localHeader).contains(header)
}

const assertTabbedLocalNav = (nav) => {
  cy.get(selectors.tabbedLocalNav).contains(nav)
}

module.exports = {
  assertKeyValueTable,
  assertValueTable,
  assertBreadcrumbs,
  testBreadcrumbs,
  assertFieldInput,
  assertFieldUneditable,
  assertLocalHeader,
  assertTabbedLocalNav,
}
