it('should display the login page correctly', () => {
  cy.visit('http://localhost:63854/?path=/story/buttonlink--default')
  cy.get('#storybook-preview-iframe').should('be.visible')

  cy.compareSnapshot('results')
})
