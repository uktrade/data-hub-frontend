describe('Pie chart', () => {
  it('should render the pie chart correctly', () => {
    cy.visit('/iframe.html?id=piechart--default')
    cy.get('#root').should('be.visible').compareSnapshot('piechart--default')
  })
})
