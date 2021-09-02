describe('Default', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  it('should render the input typeahead component correctly', () => {
    cy.visit('/iframe.html?id=forms-typeahead--default')
    cy.get('#root').should('be.visible').compareSnapshot('typeahead')
  })
})
