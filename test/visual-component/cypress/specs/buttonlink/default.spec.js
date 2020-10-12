it('should display the login page correctly', () => {
  cy.visit('http://localhost:63854/iframe.html?id=buttonlink--default')
  cy.get('#root').should('be.visible').compareSnapshot('buttonlink-default')
})
