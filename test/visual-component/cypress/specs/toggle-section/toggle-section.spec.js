describe('ToggleSection', () => {
  it('should render the default single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--default-single')
    cy.get('#root').should('be.visible').compareSnapshot('default-single')
  })
  it('should render the default multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--default-multiple')
    cy.get('#root').should('be.visible').compareSnapshot('default-multi')
  })
  it('should render the no highlight single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--no-highlight-single')
    cy.get('#root').should('be.visible').compareSnapshot('no-highlight-single')
  })
  it('should render the no highlight multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--no-highlight-multiple')
    cy.get('#root').should('be.visible').compareSnapshot('no-highlight-multi')
  })
  it('should render the dashboard single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--dashboard-single-with-badge')
    cy.get('#root').should('be.visible').compareSnapshot('dashboard-single')
  })
  it('should render the dashboard multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--dashboard-multiple')
    cy.get('#root').should('be.visible').compareSnapshot('dashboard-multi')
  })
})
