const { keys, forEach, omit, isEmpty, isObject } = require('lodash')

const selectors = require('../../../selectors')

const assertKeyValueTable = (dataAutoId, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1

    if (expected[key] === null) {
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should(
        'have.text',
        key
      )
    } else if (expected[key].href) {
      cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should(
        'have.text',
        key
      )
      cy.get(
        selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)
      ).should('have.attr', 'href', expected[key].href)
      cy.get(
        selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)
      ).should('have.text', expected[key].name)
    } else {
      cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should(
        'have.text',
        key
      )
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should(
        'have.text',
        expected[key]
      )
    }
  })
}

const assertValueTable = (dataAutoId, expected) => {
  forEach(expected, (expectedValue, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should(
      'have.text',
      expectedValue
    )
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
const assertBreadcrumbs = (specs) => {
  const entries = Object.entries(specs)
  cy.contains(Object.keys(specs).join(''))
    .children('li')
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedText, expectedHref] = entries[i]
      cy.get(x)
        .contains(expectedText)
        .invoke('attr', 'href')
        .should('eq', expectedHref || undefined)
    })
}

/**
 * @description Same as asserBreadcrumbs but already wrapped in an `it` block.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 */
const testBreadcrumbs = (specs) =>
  it('Should render breadcrumbs', () => assertBreadcrumbs(specs))

const assertFieldUneditable = ({ element, label, value = null }) =>
  cy
    .wrap(element)
    .find('label')
    .should('have.text', label)
    .parent()
    .then(($el) => value && cy.wrap($el).should('contain', value))

const assertFieldSelect = ({
  element,
  label,
  optionsCount = 0,
  value = null,
  newValue = null,
}) =>
  cy
    .wrap(element)
    .as('fieldSelect')
    .find('label')
    .first()
    .should('have.text', label)
    .next()
    .find('option')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldSelect')
          .find('option[selected]')
          .should('have.text', value)
    )
    .then(
      () =>
        newValue &&
        cy
          .get('@fieldSelect')
          .find('select')
          .select(newValue)
    )

const assertFieldRadios = ({
  element,
  label,
  value = null,
  newValue = null,
  optionsCount,
}) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('label')
    .first()
    .should('have.text', label)
    .parent()
    .find('input')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input[checked]')
          .next()
          .should('have.text', value)
    )

const assertFieldInput = ({ element, label, value = null, newValue = null }) =>
  cy
    .wrap(element)
    .find('label')
    .contains(label)
    .next()
    .find('input')
    .then(($el) => value && cy.wrap($el).should('have.attr', 'value', value))
    .then(
      ($el) =>
        newValue &&
        cy
          .wrap($el)
          .clear()
          .type(newValue)
    )

const assertFieldAddress = ({
  element,
  label,
  hint = null,
  value = {},
  newValue = null,
}) => {
  const isUkBased = value.country.name === 'United Kingdom'
  const addressElements = [
    {
      assert: ({ element }) => cy.wrap(element).should('have.text', 'Address'),
    },
    hint && {
      assert: ({ element }) => cy.wrap(element).should('have.text', hint),
    },
    {
      label: isUkBased ? 'Postcode' : 'Postcode (optional)',
      value: value.postcode,
      assert: assertFieldInput,
    },
    isUkBased && {
      assert: ({ element }) =>
        cy
          .wrap(element)
          .should('contain', 'Find UK address')
          .and('match', 'button'),
    },
    {
      label: 'Address line 1',
      value: value.line_1,
      assert: assertFieldInput,
    },
    {
      label: 'Address line 2 (optional)',
      value: value.line_2,
      assert: assertFieldInput,
    },
    {
      label: 'Town or city',
      value: value.town,
      assert: assertFieldInput,
    },
    {
      label: 'County (optional)',
      value: value.county,
      assert: assertFieldInput,
    },
    {
      label: 'Country',
      value: value.country.name,
      assert: assertFieldUneditable,
    },
  ].filter(isObject)
  cy.wrap(element)
    .as('field')
    .get('fieldset')
    .children()
    .each((item, i) => {
      if (addressElements[i]) {
        const { assert, ...params } = addressElements[i]
        assert({ element: item, ...params })
      }
    })
}

const assertDetails = ({ element, summary, content }) =>
  cy
    .wrap(element)
    .find('summary')
    .should('have.text', summary)
    .next()
    .should('have.text', content)

const assertLocalHeader = (header) => {
  cy.get(selectors.localHeader).contains(header)
}

const assertTabbedLocalNav = (nav) => {
  cy.get(selectors.tabbedLocalNav).contains(nav)
}

const assertSummaryList = (listElement, specs) => {
  const entries = Object.entries(specs)
  cy.wrap(listElement)
    .children()
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedLabel, expectedValue] = entries[i]
      cy.get(x)
        .find('dt')
        .should('have.text', expectedLabel)
      cy.get(x)
        .find('dd')
        .should('have.text', expectedValue)
    })
}

module.exports = {
  assertKeyValueTable,
  assertValueTable,
  assertBreadcrumbs,
  testBreadcrumbs,
  assertFieldInput,
  assertFieldSelect,
  assertFieldRadios,
  assertFieldAddress,
  assertFieldUneditable,
  assertDetails,
  assertLocalHeader,
  assertTabbedLocalNav,
  assertSummaryList,
}
