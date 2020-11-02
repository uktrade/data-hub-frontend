describe('Default', () => {
  it('should render the default component correctly', () => {
    cy.visit('/iframe.html?id=buttonlink--default')
    cy.get('#root').should('be.visible').compareSnapshot('buttonlink-default')
  })
})

describe('Inline', () => {
  it('should render the inline component correctly', () => {
    cy.visit('/iframe.html?id=buttonlink--inline')
    cy.get('#root').should('be.visible').compareSnapshot('buttonlink-inline')
  })
})
