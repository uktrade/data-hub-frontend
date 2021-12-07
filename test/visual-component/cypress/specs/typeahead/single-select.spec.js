describe('Single select', () => {
  it('should render the typeahead single select correctly', () => {
    cy.visit('/iframe.html?id=typeahead--single-standard-options')
    cy.get('#root').should('be.visible').compareSnapshot('typeahead-single')
  })

  it('should render the typeahead with error correctly', () => {
    cy.visit('/iframe.html?id=typeahead--single-error')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-single-error')
  })

  it('should render the typeahead with pre-selected option correctly', () => {
    cy.visit('/iframe.html?id=typeahead--single-pre-selected-option')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-single-pre-selected-option')
  })
})
