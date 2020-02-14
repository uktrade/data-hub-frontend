const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')
const { get, includes, startsWith, keys } = require('lodash')

const {
  getKeyValueTableRowValueCell,
  getTableValueCell,
  getDataTableRowCell,
} = require('../../helpers/selectors')
const formatters = require('../../helpers/formatters')

const Details = client.page.details()

const ignoredKeys = [
  'Business type', // todo: case issues
  'Sector', // todo: https://uktrade.atlassian.net/browse/DH-1086
]

const TABLE_TYPE = {
  KEY_VALUE: {
    rowCellSelector: getKeyValueTableRowValueCell,
  },
  VALUE: {
    rowCellSelector: getTableValueCell,
  },
  DATA: {
    rowCellSelector: getDataTableRowCell,
  },
}

function getExpected(key, state) {
  if (includes(key, '.') && !includes(key, ' ') && !startsWith(key, '£')) {
    const expectedText = get(state, key)

    if (key === 'investmentProject.clientContact') {
      // contact in investmentProjects create form has ', job_title` appended, this split removes that to run this check
      return { value: expectedText.split(',')[0].trim() }
    }
    if (key === 'interaction.contact') {
      return { value: expectedText.split(',')[0].trim() }
    }

    return { value: expectedText }
  }

  return { value: key }
}

const removeFalsey = (details, state) => {
  return details.filter((detail) => {
    const hasValue = /\D(\.)\D/gi.test(detail.value)
      ? get(state, detail.value)
      : detail.value

    return hasValue
  })
}

const assertTableRowCount = async function(tableSelector, expectedData) {
  await Details.api.elements(
    'xpath',
    `${tableSelector.selector}/tbody/tr`,
    (result) => {
      client
        .expect(result.value.length, 'Table row count')
        .to.equal(expectedData.length)
    }
  )
}

const assertTableContent = async function(
  tableSelector,
  expectedData,
  tableType
) {
  for (const row of expectedData) {
    const columnKeys = keys(row)
    const rowFirstCellKey = columnKeys[0]

    for (const [columnIndex, columnKey] of columnKeys.entries()) {
      const canIgnoreKeyColumn =
        tableType !== TABLE_TYPE.VALUE && columnIndex === 0
      if (
        includes(ignoredKeys, row[rowFirstCellKey]) ||
        canIgnoreKeyColumn ||
        columnKey === 'formatter'
      ) {
        continue
      }

      const rowCellSelector = tableType.rowCellSelector(
        row[rowFirstCellKey],
        columnIndex
      )
      const tableRowCellXPathSelector =
        tableSelector.selector + rowCellSelector.selector
      const expected = getExpected(row[columnKey], this.state)
      await Details.api
        .useXpath()
        .waitForElementPresent(tableRowCellXPathSelector)
        .getText(tableRowCellXPathSelector, (actual) => {
          if (row.formatter) {
            return client.expect(
              formatters[row.formatter](expected.value, actual.value),
              row[rowFirstCellKey]
            ).to.be.true
          }
          client
            .expect(actual.value, row[rowFirstCellKey])
            .to.equal(expected.value)
        })
        .useCss()
    }
  }
}

Then(
  /^details view data for "(.+)" should contain what I entered for "(.+)" field$/,
  async function(detailsItemName, fieldName) {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details.api
      .useXpath()
      .waitForElementPresent(detail.selector)
      .assert.containsText(detail.selector, this.state[fieldName])
      .useCss()
  }
)

Then(
  /^details view data for "(.+)" should contain "(.+)"$/,
  async (detailsItemName, value) => {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details.api
      .useXpath()
      .waitForElementPresent(detail.selector)
      .assert.containsText(detail.selector, value)
      .useCss()
  }
)

Then(/^the (.+) values are displayed$/, async function(tableTitle, dataTable) {
  const expectedKeyValues = removeFalsey(dataTable.hashes(), this.state)
  const tableSelector = Details.getSelectorForValueTable(tableTitle)

  await assertTableRowCount(tableSelector, expectedKeyValues)
  await assertTableContent.bind(this)(
    tableSelector,
    expectedKeyValues,
    TABLE_TYPE.VALUE
  )
})

Then(/^the (.+) values are not displayed$/, async function(tableTitle) {
  const tableSelector = Details.getSelectorForKeyValueTable(tableTitle)

  await Details.api
    .useXpath()
    .assert.elementNotPresent(tableSelector.selector)
    .useCss()
})

Then(/^the (.+) key value details are displayed$/, async function(
  tableTitle,
  dataTable
) {
  const expectedKeyValues = removeFalsey(dataTable.hashes(), this.state)
  const tableSelector = Details.getSelectorForKeyValueTable(tableTitle)

  await assertTableRowCount(tableSelector, expectedKeyValues)
  await assertTableContent.bind(this)(
    tableSelector,
    expectedKeyValues,
    TABLE_TYPE.KEY_VALUE
  )
})

Then(/^the (.+) key value details are not displayed$/, async function(
  tableTitle
) {
  const tableSelector = Details.getSelectorForKeyValueTable(tableTitle)

  await Details.api
    .useXpath()
    .assert.elementNotPresent(tableSelector.selector)
    .useCss()
})

Then(/^the key value details are displayed$/, async function(dataTable) {
  const expectedKeyValues = removeFalsey(dataTable.hashes(), this.state)
  const tableSelector = Details.getSelectorForKeyValueTable()

  await assertTableRowCount(tableSelector, expectedKeyValues)
  await assertTableContent.bind(this)(
    tableSelector,
    expectedKeyValues,
    TABLE_TYPE.KEY_VALUE
  )
})

Then(/^the (.+) data details are displayed$/, async function(
  tableTitle,
  dataTable
) {
  const tableSelector = Details.getSelectorForDataTable(tableTitle)

  await assertTableRowCount(tableSelector, dataTable.hashes())
  await assertTableContent.bind(this)(
    tableSelector,
    dataTable.hashes(),
    TABLE_TYPE.DATA
  )
})

Then(/^the data details ([0-9]+) are displayed$/, async function(
  tableNumber,
  dataTable
) {
  const tableSelector = Details.getSelectorForDataTableNumber(tableNumber)

  await assertTableRowCount(tableSelector, dataTable.hashes())
  await assertTableContent.bind(this)(
    tableSelector,
    dataTable.hashes(),
    TABLE_TYPE.DATA
  )
})
