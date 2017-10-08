/**
 * Gets XPath selector for element containing text
 * @param text
 * @param el
 * @param className
 * @param child
 * @returns {{selector: string, locateStrategy: string}}
 */
function getSelectorForElementWithText (text, { el = '//*', className, child } = {}) {
  const classNameContains = className ? ` and contains(@class, "${className}")` : ''

  return {
    selector: `${el}[contains(.,"${text}")${classNameContains}]${child || ''}`,
    locateStrategy: 'xpath',
  }
}

module.exports = {
  getSelectorForElementWithText,
}
