const selectors = require('../../../selectors')

const { keys, forEach } = require('lodash')

const assertError = (message) => {
  cy.get('body').should('contain', message)
}

const assertCollection = (headerCountSelector, collectionItemsSelector) => {
  cy.get(headerCountSelector)
    .invoke('text')
    .then((headerCount) => {
      cy.get(collectionItemsSelector).should((collectionItems) => {
        expect(headerCount).to.eq(collectionItems.length.toString())
      })
    })
}

const assertKeyValueTable = (dataAutoId, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should(
      'have.text',
      key
    )

    if (expected[key].href) {
      cy.get(
        selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)
      ).should('have.attr', 'href', expected[key].href)
      cy.get(
        selectors.keyValueTable(dataAutoId).valueCellLink(rowNumber)
      ).should('have.text', expected[key].name)
    } else {
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should(
        'have.text',
        expected[key]
      )
    }
  })
}

const assertLocalNav = (selector, navList) => {
  const navElement = cy.get(selector)
  navElement.should('have.length', navList.length)

  navList.forEach((nav) => {
    navElement.should('contain', nav)
  })
}

module.exports = {
  assertError,
  assertCollection,
  assertLocalNav,
  assertKeyValueTable,
}
