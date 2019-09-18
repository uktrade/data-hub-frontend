const { keys, forEach } = require('lodash')

const selectors = require('../../../selectors')

const assertKeyValueTable = (dataAutoId, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should('have.text', key)

    if (expected[key].href) {
      cy.get(selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)).should('have.attr', 'href', expected[key].href)
      cy.get(selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)).should('have.text', expected[key].name)
    } else {
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

module.exports = {
  assertKeyValueTable,
  assertValueTable,
}
