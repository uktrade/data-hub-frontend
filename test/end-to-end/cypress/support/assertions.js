const validateErrorCode = (selector, statusCode) => {
  cy.get(selector).should('contain', statusCode)
}

const verifyCollection = (headerCountSelector, collectionItemsSelector) => {
  cy.get(headerCountSelector).invoke('text').then((headerCount) => {
    cy.get(collectionItemsSelector).should((collectionItems) => {
      expect(headerCount).to.eq(collectionItems.length.toString())
    })
  })
}

module.exports = {
  validateErrorCode,
  verifyCollection,
}
