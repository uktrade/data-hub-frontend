describe('Multi select', () => {
  it('should render the typeahead multi select correctly', () => {
    cy.visit('/iframe.html?id=typeahead-multiple-select--standard-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-select')
  })

  it('should render the typeahead with pre-selected options correctly', () => {
    cy.visit(
      '/iframe.html?id=typeahead-multiple-select--options-pre-selected-option'
    )
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-pre-selected-options')
  })

  it('should render the async typeahead options correctly', () => {
    cy.visit('/iframe.html?id=typeahead-multiple-select--async-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-async-options')
  })

  it('should render the async typeahead with pre-selected options correctly', () => {
    cy.visit(
      '/iframe.html?id=typeahead-multiple-select--async-options-pre-selected-option'
    )
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-async-pre-selected-options')
  })
})
