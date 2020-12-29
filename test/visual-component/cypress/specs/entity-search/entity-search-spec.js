describe('Entity list DNB', () => {
  it('should render the entity list dnb component correctly', () => {
    cy.visit('/iframe.html?id=entitysearch--entitylist-dnb')
    cy.get('#root').should('be.visible').compareSnapshot('entity-list-dnb')
  })
})
