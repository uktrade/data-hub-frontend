const { keys, forEach } = require('lodash')

const selectors = require('../selectors')

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

const assertBreadcrumbs = (expected) => {
  Object.keys(expected).map((text, index) => {
    const href = expected[text]
    const breadcrumbNumber = index + 1

    if (href) {
      cy.get(selectors.breadcrumbs.item.byNumber(breadcrumbNumber)).should('have.text', text)
      cy.get(selectors.breadcrumbs.item.byNumber(breadcrumbNumber)).should('have.attr', 'href', href)
    } else {
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', text)
    }
  })
}

module.exports = {
  assertKeyValueTable,
  assertValueTable,
  assertBreadcrumbs,
}
