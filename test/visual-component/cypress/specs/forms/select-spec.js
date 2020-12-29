describe('Default', () => {
  it('should render the input select component correctly', () => {
    cy.visit('/iframe.html?id=forms-select--default')
    cy.get('#root').should('be.visible').compareSnapshot('default')
  })
})
