describe('Multi select', () => {
  it('should render the typeahead multi select correctly', () => {
    cy.visit('/iframe.html?id=typeahead--multi-standard-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-standard-options')
  })

  it('should render the typeahead with pre-selected options correctly', () => {
    cy.visit('/iframe.html?id=typeahead--multi-pre-selected-option')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-pre-selected-options')
  })

  it('should render the async typeahead options correctly', () => {
    cy.visit('/iframe.html?id=typeahead--multi-async-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-async-options')
  })

  it('should render the async typeahead with pre-selected options correctly', () => {
    cy.visit('/iframe.html?id=typeahead--multi-pre-selected-async-option')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead-multi-async-pre-selected-options')
  })
})
