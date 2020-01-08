/**
 * Gets XPath selector for element containing text
 * @param text
 * @param el
 * @param className
 * @param child
 * @returns {{selector: string, locateStrategy: string}}
 */
function getSelectorForElementWithText(
  text,
  { el = '//*', className, child, hasExactText = false } = {}
) {
  const classNameContains = className
    ? ` and contains(@class, "${className}")`
    : ''
  const textMatch = hasExactText
    ? `./text()="${text}"`
    : `contains(.,"${text}")`

  return {
    selector: `${el}[${textMatch}${classNameContains}]${child || ''}`,
    locateStrategy: 'xpath',
  }
}

/**
 * Gets XPath selector for button containing text
 * @param text
 * @returns {{selector: string, locateStrategy: string}}
 */
function getButtonWithText(text) {
  return getSelectorForElementWithText(text, {
    el: '//*',
    className: 'govuk-button',
  })
}

/**
 * Gets XPath selector for the value of a details table key value pair
 * @param text
 * @returns {{selector: string, locateStrategy: string}}
 */
function getKeyValueTableRowValueCell(text) {
  return getSelectorForElementWithText(text, {
    el: '//th',
    child: '/following-sibling::td',
    hasExactText: true,
  })
}

/**
 * Gets XPath selector for a table cell contain text
 * @param text
 * @returns {{selector: string, locateStrategy: string}}
 */
function getTableValueCell(text) {
  return getSelectorForElementWithText(text, {
    el: '//td',
    hasExactText: true,
  })
}

function getDataTableRowCell(text, index) {
  return getSelectorForElementWithText(text, {
    el: '//td',
    child: `/following-sibling::td[${index}]`,
    hasExactText: true,
  })
}

/**
 * Gets XPath selector the selector for the meta item label value from entity lists
 * @param text
 * @returns {{selector: string, locateStrategy: string}}
 */
function getMetaListItemValueSelector(text) {
  return getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  })
}

/**
 * Gets XPath selector for getting a meta list item from a specific item in a collection item
 * @param text
 * @param [listItem=1]
 */
const getListItemMetaElementWithText = (text, listItem = 1) =>
  getSelectorForElementWithText(text, {
    el: `//article[contains(@class, "c-collection")]//ol[contains(@class,"c-entity-list")]/li[${listItem}]//span`,
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  })

/**
 * Gets XPath selector for an anchor tag containing text
 * @param text
 * @param className
 * @returns {{selector: string, locateStrategy: string}}
 */
function getLinkWithText(text, className) {
  return getSelectorForElementWithText(text, {
    el: '//a',
    className,
  })
}

/**
 * Gets XPath selector for an anchor tag following a specified section
 * @param sectionTitle
 * @param buttonText
 * @returns {{selector: string, locateStrategy: string}}
 */
const getSelectorForDetailsSectionEditButton = (
  sectionTitle,
  buttonText = 'Edit'
) => {
  return getSelectorForElementWithText(sectionTitle, {
    el: '//h2',
    child: '/following-sibling::a[contains(.,"Edit")]',
  })
}

module.exports = {
  getSelectorForElementWithText,
  getButtonWithText,
  getKeyValueTableRowValueCell,
  getTableValueCell,
  getDataTableRowCell,
  getMetaListItemValueSelector,
  getLinkWithText,
  getListItemMetaElementWithText,
  getSelectorForDetailsSectionEditButton,
}
