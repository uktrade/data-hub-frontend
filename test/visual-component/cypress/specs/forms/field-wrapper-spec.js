describe('Label', () => {
  it('should render the input label component correctly', () => {
    cy.visit('/iframe.html?id=forms--fieldwrapper-label')
    cy.get('#field-testField').should('be.visible').compareSnapshot('label')
  })
})

describe('Label', () => {
  it('should render the input legend component correctly', () => {
    cy.visit('/iframe.html?id=forms--fieldwrapper-legend')
    cy.get('#root').should('be.visible').compareSnapshot('legend')
  })
})
