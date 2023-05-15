describe('Local header details', () => {
  it('should render the local header details component correctly', () => {
    cy.visit('iframe.html?args=&id=localheader-localheaderdetails--default')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('local-header-details--default')
  })
})
