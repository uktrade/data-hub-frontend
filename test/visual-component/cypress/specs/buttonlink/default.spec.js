it('should display the login page correctly', () => {
  cy.visit('/iframe.html?id=buttonlink--default')
  cy.get('#root').should('be.visible').compareSnapshot('buttonlink-default')
})
