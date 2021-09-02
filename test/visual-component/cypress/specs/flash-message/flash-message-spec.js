describe('Default', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  it('should render the flash message component correctly', () => {
    cy.visit('/iframe.html?id=flash-messages--default')
    cy.get('#root').should('be.visible').compareSnapshot('default')
  })
})
