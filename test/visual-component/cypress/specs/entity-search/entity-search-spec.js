describe('Entity list DNB', () => {
  it('should render the entity list dnb component correctly', () => {
    cy.visit('/iframe.html?id=entitysearch--entity-list-dn-b')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('entity-list-dnb')
  })
})
