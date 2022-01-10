describe('Multi select', () => {
  it('should render the typeahead2 multi select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--multi-standard-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-multi-select')
  })

  it('should render the typeahead2 with pre-selected options correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--multi-pre-selected-option')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-multi-pre-selected-options')
  })

  it('should render the typeahead2 with multiple pre-selected options correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--multi-pre-selected-multiple-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-multi-pre-selected-multiple-options')
  })

  it('should render the async typeahead2 multi select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--multi-async-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-multi-async-options')
  })

  it('should render the async typeahead2 multi select correctly', () => {
    cy.visit('/iframe.html?id=typeahead2--multi-async-pre-selected-options')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('typeahead2-multi-async-pre-selected-multiple-options')
  })
})
