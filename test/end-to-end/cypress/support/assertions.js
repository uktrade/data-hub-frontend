const { keys, forEach } = require('lodash')

const selectors = require('../../../selectors')

const PAGE_SIZE = 10

const assertError = (message) => {
  cy.get('body').should('contain', message)
}

const assertCollection = (headerCountSelector, hasItems = true) => {
  cy.get(`[data-test=${headerCountSelector}]`)
    .invoke('text')
    .then((headerCount) => {
      const hasMoreThanOnePage = headerCount > PAGE_SIZE

      if (hasItems) {
        cy.get('[data-test=collection-item]').should((items) => {
          expect(items.length).to.eq(
            hasMoreThanOnePage ? PAGE_SIZE : Number(headerCount)
          )
        })
      }

      if (hasMoreThanOnePage) {
        const totalPages = Math.ceil(headerCount / PAGE_SIZE)
        cy.get('[data-test="pagination-summary"]').contains(
          `Page 1 of ${totalPages}`
        )
        cy.get('[data-test="next"]').should('be.visible')
      }
    })
}

const assertKeyValueTable = (dataTest, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataTest).keyCell(rowNumber)).should(
      'have.text',
      key
    )

    if (expected[key].href) {
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
      cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
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

function assertTabNav({ tabs, selectedIndex }) {
  cy.viewport(1024, 768)
  cy.get('[data-test="tablist"]')
    .should('exist')
    .and('have.attr', 'role', 'tablist')

  cy.get('[data-test="tablist"] [role="tab"]').should(
    'have.length',
    tabs.length
  )

  tabs.forEach((tabText, index) => {
    cy.get('[data-test="tablist"] [role="tab"]')
      .eq(index)
      .should('have.text', tabText)
      .and(
        'have.attr',
        'aria-selected',
        index === selectedIndex ? 'true' : 'false'
      )
      .and('have.attr', 'tabindex', index === selectedIndex ? '0' : '-1')
  })
}

const assertActivitytab = (selector) => {
  const navElement = cy.get(selector)
  navElement.should('be.checked')
}

const assertLocalReactNav = (selector, navList) => {
  cy.get(selector).as('navElements')
  cy.get('@navElements').should(
    'have.prop',
    'childElementCount',
    navList.length
  )

  navList.forEach((nav) => {
    cy.get('@navElements').should('contain', nav)
  })
}

module.exports = {
  assertError,
  assertCollection,
  assertLocalNav,
  assertTabNav,
  assertKeyValueTable,
  assertLocalReactNav,
  assertActivitytab,
}
