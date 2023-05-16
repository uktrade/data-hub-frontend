describe('Timeline', () => {
  it('should render the default timeline correctly', () => {
    cy.visit('/iframe.html?id=timeline--default')
    cy.get('#storybook-root').should('be.visible').compareSnapshot('default')
  })
  it('should render the first stage of a timeline correctly', () => {
    cy.visit('/iframe.html?id=timeline--first-stage')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('first-stage')
  })
  it('should render the complete timeline correctly', () => {
    cy.visit('/iframe.html?id=timeline--complete')
    cy.get('#storybook-root').should('be.visible').compareSnapshot('complete')
  })
})
