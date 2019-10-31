const assertError = (message) => {
  cy.get('h3').should('contain', message)
}

const assertCollection = (headerCountSelector, collectionItemsSelector) => {
  cy.get(headerCountSelector).invoke('text').then((headerCount) => {
    cy.get(collectionItemsSelector).should((collectionItems) => {
      expect(headerCount).to.eq(collectionItems.length.toString())
    })
  })
}

const assertNav = (selector, navList) => {
  const navElement = cy.get(selector)
  navElement.should('have.length', navList.length)

  navList.forEach(nav => {
    navElement.should('contain', nav)
  })
}

module.exports = {
  assertError,
  assertCollection,
  assertNav,
}
