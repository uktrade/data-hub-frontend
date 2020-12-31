describe('Text', () => {
  it('should render the text input component correctly', () => {
    cy.visit('/iframe.html?id=forms-input--text')
    cy.get('#root').should('be.visible').compareSnapshot('text')
  })
})

describe('Number', () => {
  it('should render the number input component correctly', () => {
    cy.visit('/iframe.html?id=forms-input--number')
    cy.get('#root').should('be.visible').compareSnapshot('number')
  })
})

describe('Reduced text', () => {
  it('should render the reduced text input component correctly', () => {
    cy.visit('/iframe.html?id=forms-input--text-reduced')
    cy.get('#root').should('be.visible').compareSnapshot('reduced-text')
  })
})
