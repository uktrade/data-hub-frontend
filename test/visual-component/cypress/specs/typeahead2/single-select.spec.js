describe('Single select', () => {
  it('should render the typeahead2 single select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2-single-select--standard-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-single-select')
  })
})
