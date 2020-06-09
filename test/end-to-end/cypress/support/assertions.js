const { keys, forEach } = require('lodash')

const selectors = require('../../../selectors')

const PAGE_SIZE = 10

const assertError = (message) => {
  cy.get('body').should('contain', message)
}

const assertCollection = (headerCountSelector, collectionItemsSelector) => {
  cy.get(headerCountSelector)
    .invoke('text')
    .then((headerCount) => {
      const hasMoreThanOnePage = headerCount > PAGE_SIZE

      cy.get(collectionItemsSelector).should((collectionItems) => {
        expect(collectionItems.length).to.eq(
          hasMoreThanOnePage ? PAGE_SIZE : Number(headerCount)
        )
      })

      if (hasMoreThanOnePage) {
        const totalPages = Math.ceil(headerCount / PAGE_SIZE)
        cy.get('.c-collection__pagination-summary').contains(
          `Page 1 of ${totalPages}`
        )

        cy.get('.c-pagination__label--next').should('be.visible')
      }
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
