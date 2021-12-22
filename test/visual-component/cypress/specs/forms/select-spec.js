describe('Default', () => {
  before(() => {
    cy.viewport(2980, 2440)
  })

  it('should render the input select component correctly', () => {
    cy.visit('/iframe.html?id=form-form-elements-select--default')
    cy.get('#root').should('be.visible').compareSnapshot('default')
  })
})
