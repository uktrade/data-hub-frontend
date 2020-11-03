describe('Default', () => {
  it('should render the default component correctly', () => {
    cy.visit('/iframe.html?id=company-local-header--default')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('company-local-header-default')
  })
})
