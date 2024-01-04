/**
 * @deprecated
 * THE LOGIC IN THIS FILE HAS BEEN MOVED TO THE /test/support FOLDER AS THE LOGIC IS SHARED BETWEEN
 *  THE COMPONENT AND FUNCTIONAL TESTS. THIS FILE IS ONLY HERE TO AVOID BREAKING ANY TESTS, NO
 * ADDITIONAL LOGIC SHOULD BE ADDED
 */

const { keys, forEach, isObject } = require('lodash')
const qs = require('qs')

const selectors = require('../../../selectors')
const urls = require('../../../../src/lib/urls')

/**
 * @deprecated Use the version in /test/support folder
 */
const assertKeyValueTable = (dataTest, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1

    if (expected[key] === null) {
      cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
        'have.text',
        key
      )
    } else if (expected[key].href) {
      cy.get(selectors.keyValueTable(dataTest).keyCell(rowNumber)).should(
        'have.text',
        key
      )
      cy.get(selectors.keyValueTable(dataTest).valueCellLink(rowNumber)).should(
        'have.attr',
        'href',
        expected[key].href
      )
      cy.get(selectors.keyValueTable(dataTest).valueCellLink(rowNumber)).should(
        'have.text',
        expected[key].name
      )
    } else {
      cy.get(selectors.keyValueTable(dataTest).keyCell(rowNumber)).should(
        'have.text',
        key
      )
      cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
        'have.text',
        expected[key]
      )
    }
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertValueTable = (dataTest, expected) => {
  forEach(expected, (expectedValue, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
      'have.text',
      expectedValue
    )
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertSummaryTable = ({
  dataTest,
  heading,
  showEditLink,
  content,
  editLinkText = 'Edit',
}) => {
  const summaryTableSelector = `[data-test="${dataTest}"]`

  if (heading) {
    cy.get(summaryTableSelector).find('caption').should('contain', heading)
  }
  cy.get(summaryTableSelector)
    .contains(editLinkText)
    .should(showEditLink ? 'be.visible' : 'not.exist')

  if (typeof content !== 'undefined') {
    Array.isArray(content)
      ? assertValueTable(dataTest, content)
      : assertKeyValueTable(dataTest, content)
  }
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertGovReactTable = ({ element, headings, rows }) => {
  cy.get(element).as('table')

  if (headings) {
    cy.get('@table').find('th')
  }

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

/**
 * @deprecated Use the version in /test/support folder
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
  cy.get('[data-test=breadcrumbs] > ol')
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
 * @deprecated Use the version in /test/support folder
 * @description Same as assertBreadcrumbs but already wrapped in an `it` block.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 */
const testBreadcrumbs = (specs) =>
  it('should render breadcrumbs', () => assertBreadcrumbs(specs))

/**
 * @deprecated Use the version in /test/support folder
 * Asserts that the breadcrumbs on company pages appear correctly
 */
const assertCompanyBreadcrumbs = (companyName, detailsUrl, lastCrumb) => {
  testBreadcrumbs({
    Home: urls.dashboard.index(),
    Companies: urls.companies.index(),
    [companyName]: detailsUrl,
    [lastCrumb]: null,
  })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldUneditable = ({ element, label, value = null }) =>
  cy
    .wrap(element)
    .find('label')
    .should('have.text', label)
    .parent()
    .parent()
    .then(($el) => value && cy.wrap($el).should('contain', value))

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldSelect = ({
  element,
  label,
  emptyOption,
  value,
  optionsCount,
}) =>
  cy
    .wrap(element)
    .as('fieldSelect')
    .then(() => {
      label &&
        cy.get('@fieldSelect').find('label').first().should('have.text', label)

      emptyOption &&
        cy
          .get('@fieldSelect')
          .find('option')
          .first()
          .should('have.text', emptyOption)

      optionsCount &&
        cy
          .get('@fieldSelect')
          .find('option')
          .should('have.length', optionsCount)

      value &&
        cy
          .get('@fieldSelect')
          .find('option[selected]')
          .should('have.text', value)
    })

/**
 * @deprecated Use the version in /test/support folder
 * @description Asserts a list of <select> options
 * @param {String} element - the CSS <select> selector
 * @param {Array} options - an array of options to assert
 * @example
 * it('Should assert a list of <select> options' =>
 *   assertSelectOptions({
 *     'element': 'select option',
 *     'options': [
 *        {
 *          value: "1",
 *          label: "Commitment to invest",
 *        },
 *        {
 *          value: "2",
 *          label: "FDI",
 *        },
 *        {
 *          "value": "3",
 *          "label": "Non-FDI",
 *        }
 *      ]
 *   })
 * )
 */
const assertSelectOptions = (element, expectedOptions) =>
  cy.get(element).then((options) => {
    expect(
      [...options].map((o) => ({
        value: o.value,
        label: o.label,
      }))
    ).to.deep.eq(expectedOptions)
  })

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldRadios = ({ element, label, value, optionsCount }) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('label')
    .first()
    .should('have.text', label)
    .parent()
    .parent()
    .find('input')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
          .should('have.text', value)
    )

// As part of the accessibility work, a sample of pages have been refactored to use legends instead of labels.
// Use this assertion for radios which have legends applied.
/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldRadiosWithLegend = ({
  element,
  legend,
  value,
  optionsCount,
}) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('legend')
    .first()
    .should('have.text', legend)
    .parent()
    .find('input')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
          .should('have.text', value)
    )

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldRadiosWithoutLabel = ({ element, value, optionsCount }) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('input')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
          .should('have.text', value)
    )

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldCheckbox = ({ element, label, value, checked }) => {
  cy.wrap(element)
    .as('fieldCheckbox')
    .find('label')
    .should('contain.text', label)

  cy.get('@fieldCheckbox')
    .find('input')
    .should('have.attr', 'value', value)
    .should(checked ? 'be.checked' : 'not.be.checked')
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldTypeahead = ({
  element,
  label,
  value,
  placeholder = '',
  hint = '',
  isMulti = true,
}) =>
  cy.wrap(element).should(($typeahead) => {
    placeholder &&
      expect($typeahead.find('input')).to.have.attr('placeholder', placeholder)

    label
      ? expect($typeahead.find('label')).to.contain(label)
      : expect($typeahead.find('label')).to.not.exist

    isMulti
      ? value && expect($typeahead).to.contain(value)
      : value && expect($typeahead.find('input')).to.have.attr('value', value)

    hint && expect($typeahead).to.contain(hint)
  })

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldSingleTypeahead = (props) =>
  assertFieldTypeahead({ ...props, isMulti: false })

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldInputWithLegend = ({
  element,
  label,
  hint = undefined,
  value = undefined,
}) =>
  cy
    .wrap(element)
    .find('label')
    .should('have.text', label)
    .parent()
    .parent()
    .next()
    .then(
      ($el) =>
        hint &&
        cy
          .wrap($el)
          .should('have.text', hint || '')
          .next()
    )

    .find('input')
    .then(
      ($el) =>
        value && cy.wrap($el).should('have.attr', 'value', String(value) || '')
    )

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldInput = ({
  element,
  label,
  hint = undefined,
  value = undefined,
  ignoreHint = false,
}) =>
  cy
    .wrap(element)
    .find('label')
    .should('have.text', label)
    .parent()
    .next()
    .then(
      ($el) =>
        hint &&
        cy
          .wrap($el)
          .should('have.text', hint || '')
          .next()
    )
    .then(
      //in the scenario where we don't need to validate what the hint is, but a hint is still
      //being rendered, skip over the hint without validating it to get to the next element
      ($el) => (ignoreHint && value ? cy.wrap($el).next() : undefined)
    )
    .find('input')
    .then(
      ($el) =>
        value && cy.wrap($el).should('have.attr', 'value', String(value) || '')
    )

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldInputNoLabel = ({ element, value = undefined }) =>
  cy
    .wrap(element)
    .find('input')
    .then(
      ($el) =>
        value && cy.wrap($el).should('have.attr', 'value', String(value) || '')
    )

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldHidden = ({ element, name, value }) =>
  cy.wrap(element).should('have.attr', 'name', name).should('have.value', value)

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldTextarea = ({ element, label, hint, value }) =>
  cy
    .wrap(element)
    .find('label')
    .should('contain', label)
    .parent()
    .next()
    .then(
      ($el) =>
        hint &&
        cy
          .wrap($el)
          .should('have.text', hint || '')
          .next()
    )
    .parent()
    .find('textarea')
    .then(($el) => value ?? cy.wrap($el).should('have.text', value || ''))

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldAddress = ({ element, hint = null, value = {} }) => {
  const isUKBased = value.country.name === 'United Kingdom'
  const isUSBased = value.country.name === 'United States'
  const isCanadianBased = value.country.name === 'Canada'
  const hasStateField = isUSBased || isCanadianBased
  const postcodeLabel = () => {
    if (isUSBased) return 'ZIP code (optional)'
    if (isCanadianBased) return 'Postal code (optional)'
    if (isUKBased) return 'Postcode'
    return 'Postcode (optional)'
  }
  if (isUKBased) {
    cy.contains('Find UK address').should('be.visible').and('match', 'button')
  }
  let addressElements = [
    {
      assert: ({ element }) =>
        cy.wrap(element).should('have.text', 'Trading address'),
    },
    hint && {
      assert: ({ element }) => cy.wrap(element).should('have.text', hint),
    },
    {
      label: 'Country',
      value: value.country.name,
      assert: assertFieldUneditable,
    },
    isUKBased && {
      label: postcodeLabel(),
      value: value.postcode,
      assert: assertFieldInput,
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
    !isUSBased &&
      !isCanadianBased && {
        label: 'County (optional)',
        value: value.county,
        assert: assertFieldInput,
      },
    hasStateField && {
      label: isCanadianBased ? 'Province' : 'State',
      value: value.area.name,
      assert: assertFieldSelect,
    },
    !isUKBased && {
      label: postcodeLabel(),
      value: value.postcode,
      assert: assertFieldInput,
    },
  ].filter(isObject)

  cy.wrap(element)
    .as('field')
    .get('[data-test="field-address"] fieldset')
    .children()
    .each((item, i) => {
      if (addressElements[i]) {
        const { assert, ...params } = addressElements[i]
        assert({ element: item, ...params })
      }
    })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldDate = ({ element, label, value = {} }) => {
  const inputs = element.find('input')

  expect(element).to.contain.text(label)
  expect(element).to.contain.text('Day')
  expect(element).to.contain.text('Month')
  expect(element).to.contain.text('Year')

  value.day && expect(inputs[0]).to.have.value(value.day)
  value.month && expect(inputs[1]).to.have.value(value.month)
  value.year && expect(inputs[2]).to.have.value(value.year)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFieldDateShort = ({ element, label, value = {} }) => {
  const labels = element.find('label')
  const inputs = element.find('input')

  label && expect(labels[0]).to.have.text(label)

  expect(labels[1]).to.have.text('Month')
  expect(labels[2]).to.have.text('Year')

  value.month && expect(inputs[0]).to.have.value(value.month)
  value.year && expect(inputs[1]).to.have.value(value.year)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFormActions = ({ element, buttons }) =>
  cy
    .wrap(element)
    .children()
    .each((element, i) => {
      cy.wrap(element).should('have.text', buttons[i]).should('match', 'button')
    })

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFormFields = (formElement, specs) =>
  formElement.children().each((element, i) => {
    if (specs[i]) {
      const spec = specs[i]
      if (spec instanceof Function) {
        spec(element)
      } else {
        const { assert, ...params } = spec
        assert({ element, ...params })
      }
    }
  })

/**
 * @deprecated Use the version in /test/support folder
 */
const assertDetails = ({ element, summary, content }) =>
  cy
    .wrap(element)
    .find('summary')
    .should('have.text', summary)
    .next()
    .should('have.text', content)

/**
 * @deprecated Use the version in /test/support folder
 */
const assertLocalHeader = (header) => {
  cy.get(selectors.localHeader).contains(header)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertTabbedLocalNav = (nav) => {
  cy.get(selectors.tabbedLocalNav).contains(nav)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertSummaryList = (listElement, specs) => {
  const entries = Object.entries(specs)
  cy.wrap(listElement)
    .children()
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedLabel, expectedValue] = entries[i]
      cy.get(x).find('dt').should('have.text', expectedLabel)
      cy.get(x).find('dd').should('have.text', expectedValue)
    })
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertAriaTablistTabSelected = (tabListLabel, tabLabel) =>
  cy
    .getDhTablistTab(tabListLabel, tabLabel)
    .should('have.attr', 'aria-selected', 'true')

/**
 * @deprecated Use the version in /test/support folder
 */
const assertFormButtons = ({ submitText, cancelText, cancelLink }) => {
  cy.contains('button', submitText)
  cy.contains('a', cancelText).should('have.attr', 'href', cancelLink)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that a checkbox is checked or unchecked
 */
const assertCheckboxGroupOption = ({ element, value, checked = true }) => {
  const checkbox = cy.get(element).find(`input[value="${value}"]`)
  if (checked) {
    checkbox.should('be.checked')
  } else {
    checkbox.should('not.be.checked')
  }
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that none of the options in a checkbox group are selected
 */
const assertCheckboxGroupNoneSelected = (element) => {
  cy.get(element)
    .find('input')
    .each((child) => cy.wrap(child).should('not.be.checked'))
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that all of the options in a checkbox group are selected
 */
const assertCheckboxGroupAllSelected = (element) => {
  cy.get(element)
    .find('input')
    .each((child) => cy.wrap(child).should('be.checked'))
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts that a typeahead `element` has the given `legend` and `placeholder`
 */
const assertTypeaheadHints = ({
  element,
  legend,
  label,
  placeholder,
  hintText,
}) => {
  cy.get(element)
    .find(`${label ? 'label' : 'legend'}`)
    .should('have.text', label ? label : legend)
  cy.get(element).find('input').should('have.attr', 'placeholder', placeholder)
  hintText && cy.get(element).find('span').should('contain', hintText)
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts that the typeahead `element` has the `expectedOption` selected
 */
const assertTypeaheadOptionSelected = ({ element, expectedOption }) => {
  cy.get(element).should('contain', expectedOption)
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts that a single-select typeahead `element` has the `expectedOption` selected
 */
const assertSingleTypeaheadOptionSelected = ({ element, expectedOption }) => {
  cy.get(element).find('input').should('have.attr', 'value', expectedOption)
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts that a chip indicator exists in the specified position
 */
const assertChipExists = ({ label, position }) => {
  cy.get(`#filter-chips button:nth-child(${position})`).should((el) => {
    expect(el.text()).to.contain(label)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts there are no chips
 */
const assertChipsEmpty = () => {
  cy.get('[data-test=filter-chips]').should('be.empty')
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts the field is empty
 */
const assertFieldEmpty = (element) => {
  cy.get(element).should('have.value', '')
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts the key-value pair are defined within the query params
 */
const assertQueryParams = (key, value) => {
  cy.url().should(
    'include',
    qs.stringify({
      [key]: value,
    })
  )
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts the key-value pair are defined within the query params
 */
const assertNotQueryParams = (key, value) => {
  cy.url().should(
    'not.include',
    qs.stringify({
      [key]: value,
    })
  )
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert the expected payload to the API
 */

const assertPayload = (apiRequest, expectedParams) => {
  cy.wait(apiRequest).then(({ request }) => {
    expect(request.body).to.deep.equal(expectedParams)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 * Asserts the url (no domain name) is contained within the API request url
 */
const assertRequestUrl = (apiRequest, url) => {
  cy.wait(apiRequest).then(({ request }) => {
    expect(request.url).to.contain(url)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that the label and value exist on the date input
 */
const assertDateInput = ({ element, label, value }) => {
  cy.get(element)
    .find('label')
    .should('contain', label)
    .parent()
    .next()
    .should('have.attr', 'value', value)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that the label and value exist on the date input where a hint is provided
 */
const assertDateInputWithHint = ({ element, label, value }) => {
  cy.get(element)
    .find('fieldset > legend > label')
    .should('contain', label)
    .parent()
    .next()
    .next()
    .should('have.attr', 'value', value)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert error summary passing in a list of errors as as an array
 */
const assertErrorSummary = (errors) => {
  cy.contains('h2', 'There is a problem')
    .next()
    .should('have.text', errors.join(''))
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert by selector if it is visible
 */
const assertVisible = (selector) => {
  cy.get(selector).should('be.visible')
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert by selector if it does not exist
 */
const assertNotExists = (selector) => {
  cy.get(selector).should('not.exist')
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert if the text is visible
 */
const assertTextVisible = (text) => {
  cy.contains(text).should('be.visible')
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert url is contained in current url
 */
const assertUrl = (url) => {
  cy.url().should('contain', url)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert url is exactly matches the current url
 */
const assertExactUrl = (url) => {
  cy.url().should('eq', `${Cypress.config('baseUrl')}${url}`)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert flash message is contained
 */
const assertFlashMessage = (message) => {
  cy.get('[data-test="status-message"]').contains(message)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that a given param is either present or not present in a URL
 */
const assertParamContainedInUrl = (xhr, param) => {
  expect(xhr.response.url).to.contain(param)
}

/**
 * @deprecated Use the version in /test/support folder
 */
const assertParamNotContainedInUrl = (xhr, param) => {
  expect(xhr.response.url).to.not.contain(param)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that the body of an intercepted request is as expected
 */
const assertRequestBody = (xhr, expectedBody) => {
  expect(xhr.request.body).to.deep.equal(expectedBody)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that the error dialog contains a task name and error message
 */
const assertErrorDialog = (taskName, errorMessage) => {
  const getErrorDialog = () => {
    return cy.get('[data-test="error-dialog"]')
  }

  getErrorDialog().should('exist')
  getErrorDialog().contains('h2', taskName)
  getErrorDialog().contains('p', errorMessage)
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert an endpoint value where a wait has been setup
 * @@param endPointAlias defined with wait and no need to assign the @ value
 * @@param assertCallback callback function to assert
 */
const assertAPIRequest = (endPointAlias, assertCallback) =>
  cy.wait(`@${endPointAlias}`).then((xhr) => assertCallback(xhr))

/**
 * @deprecated Use the version in /test/support folder
 * Assert the field element contains the expected error message
 * @param {*} element the field element that contains the error
 * @param {*} errorMessage the error message that should be displayed
 * @param {*} hasHint whether this field has a hint
 * @returns
 */
const assertFieldError = (element, errorMessage, hasHint = true) =>
  element
    .find('span')
    .eq(hasHint ? 1 : 0)
    .should('have.text', errorMessage)

/**
 * @deprecated Use the version in /test/support folder
 * Assert the typeahead element contains a chip for each of the values
 * @param {*} selector the selector for the typeahead component
 * @param {*} values the list of values that should exist in the chips
 */
const assertTypeaheadValues = (selector, values) => {
  const VALUES_ALIAS = 'typeahead-values'
  cy.get(selector).find('[data-test="typeahead-chip"]').as(VALUES_ALIAS)

  values.forEach((value) => {
    cy.get('@' + VALUES_ALIAS).contains(value)
  })
}

/**
 * @deprecated Use the version in /test/support folder
 * Assert that a link exists and that the href url is correct
 */
const assertLink = (dataTest, expected) => {
  cy.get(`[data-test=${dataTest}]`)
    .should('exist')
    .should('have.attr', 'href', expected)
}

/**
 * @deprecated Use the version in /test/support folder
 * A wrapper around assertLink that also checks the text
 */
const assertLinkWithText = (dataTest, expectedLink, expectedText) => {
  cy.get(`[data-test=${dataTest}]`).should('have.text', expectedText)
  assertLink(dataTest, expectedLink)
}

module.exports = {
  assertKeyValueTable,
  assertValueTable,
  assertSummaryTable,
  assertGovReactTable,
  assertBreadcrumbs,
  testBreadcrumbs,
  assertCompanyBreadcrumbs,
  assertFieldTypeahead,
  assertFieldSingleTypeahead,
  assertFieldInput,
  assertFieldInputWithLegend,
  assertFieldInputNoLabel,
  assertFieldTextarea,
  assertFieldSelect,
  assertSelectOptions,
  assertFieldRadios,
  assertFieldRadiosWithLegend,
  assertFieldRadiosWithoutLabel,
  assertFieldCheckbox,
  assertFieldAddress,
  assertFieldUneditable,
  assertFormActions,
  assertFieldDate,
  assertFieldDateShort,
  assertFieldHidden,
  assertFormFields,
  assertDetails,
  assertLocalHeader,
  assertTabbedLocalNav,
  assertSummaryList,
  assertAriaTablistTabSelected,
  assertFormButtons,
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertCheckboxGroupAllSelected,
  assertTypeaheadHints,
  assertSingleTypeaheadOptionSelected,
  assertTypeaheadOptionSelected,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertQueryParams,
  assertNotQueryParams,
  assertPayload,
  assertRequestUrl,
  assertDateInput,
  assertDateInputWithHint,
  assertErrorSummary,
  assertVisible,
  assertNotExists,
  assertTextVisible,
  assertUrl,
  assertFlashMessage,
  assertParamContainedInUrl,
  assertParamNotContainedInUrl,
  assertRequestBody,
  assertErrorDialog,
  assertAPIRequest,
  assertExactUrl,
  assertFieldError,
  assertTypeaheadValues,
  assertLink,
  assertLinkWithText,
}
