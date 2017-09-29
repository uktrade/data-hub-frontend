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
