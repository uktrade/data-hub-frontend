describe('Custom', () => {
  it('should render the custom component correctly', () => {
    cy.visit('/iframe.html?id=readmore--custom')
    cy.get('#root').should('be.visible').compareSnapshot('readmore--custom')
  })
})
