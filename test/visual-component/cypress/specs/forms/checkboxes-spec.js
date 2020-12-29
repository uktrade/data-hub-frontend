describe('Default', () => {
  it('should render the default checkbox component correctly', () => {
    cy.visit('/iframe.html?id=forms-checkboxes--default')
    cy.get('#root').should('be.visible').compareSnapshot('default')
  })
})

describe('Hint', () => {
  it('should render the checkbox with hint component correctly', () => {
    cy.visit('/iframe.html?id=forms-checkboxes--checkboxes-hint')
    cy.get('#root').should('be.visible').compareSnapshot('hint')
  })
})

describe('Legend', () => {
  it('should render the checkbox with legend component correctly', () => {
    cy.visit('/iframe.html?id=forms-checkboxes--checkboxes-legend')
    cy.get('#root').should('be.visible').compareSnapshot('legend')
  })
})

describe('Reduced', () => {
  it('should render the reduced checkbox component correctly', () => {
    cy.visit('/iframe.html?id=forms-checkboxes--default-reduced')
    cy.get('#root').should('be.visible').compareSnapshot('default-reduced')
  })
})

describe('Legend reduced', () => {
  it('should render the reduced legend checkbox component correctly', () => {
    cy.visit('/iframe.html?id=forms-checkboxes--checkboxes-legend-reduced')
    cy.get('#root').should('be.visible').compareSnapshot('legend-reduced')
  })
})
