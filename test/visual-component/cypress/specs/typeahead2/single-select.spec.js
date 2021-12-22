describe('Single select', () => {
  it('should render the typeahead2 single select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--single-standard-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-single-select')
  })

  it('should render the typeahead with error correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--single-error')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-single-error')
  })

  it('should render the typeahead2 with pre-selected option correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--single-pre-selected-option')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-single-pre-selected-option')
  })

  it('should render the async typeahead2 single select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--single-async-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-single-async-options')
  })
})
