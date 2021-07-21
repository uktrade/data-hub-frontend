describe('Local header details', () => {
  it('should render the local header details component correctly', () => {
    cy.visit('/iframe.html?id=local-header-details--default')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('local-header-details--default')
  })
})
