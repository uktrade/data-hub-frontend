const { getSelectorForElementWithText } = require('../helpers/selectors')

const getSelectorForTableNumber = (number, className) => {
  return {
    selector: `//table[contains(@class, "${className}")][${number}]`,
    locateStrategy: 'xpath',
  }
}

const getSelectorForTable = (title, className) => {
  if (!title) {
    return getSelectorForTableNumber(1, className)
  }

  return getSelectorForElementWithText(title, {
    el: '//h2',
    child: '//following-sibling::div/table[1]',
  })
}

module.exports = {
  elements: {
  },
  commands: [
    {
      getDetailFor (label) {
        return getSelectorForElementWithText(label, { el: '//th', child: '/following-sibling::td' })
      },
      getSelectorForKeyValueTable (title) {
        return getSelectorForTable(title, 'table--key-value')
      },
      getSelectorForValueTable (title) {
        return getSelectorForElementWithText(title, {
          el: '//h2',
          child: '//following-sibling::table[1]',
        })
      },
      getSelectorForDataTable (title) {
        return getSelectorForTable(title, 'data-table')
      },
      getSelectorForDataTableNumber (number) {
        return getSelectorForTableNumber(number, 'data-table')
      },
    },
  ],
}
