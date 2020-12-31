describe('Default', () => {
  it('should render the default component correctly', () => {
    cy.visit('/iframe.html?id=buttonlink--default')
    cy.get('#root').should('be.visible').compareSnapshot('buttonlink-default')
  })
})
