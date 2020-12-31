describe('Default', () => {
  it('should render the default component correctly', () => {
    cy.visit('/iframe.html?id=readmore--default')
    cy.get('#root').should('be.visible').compareSnapshot('readmore--default')
  })
})
