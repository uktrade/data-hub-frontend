describe('Multi select', () => {
  it('should render the typeahead2 multi select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--multi-standard-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-multi-select')
  })
})
