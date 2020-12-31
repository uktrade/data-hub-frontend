describe('Default', () => {
  it('should render the date component correctly', () => {
    cy.visit('/iframe.html?id=forms-date--fielddate-default-validation')
    cy.get('#root').should('be.visible').compareSnapshot('default')
  })
})

describe('Custom', () => {
  it('should render the custom date component correctly', () => {
    cy.visit('/iframe.html?id=forms-date--fielddate-custom-validation')
    cy.get('#root').should('be.visible').compareSnapshot('custom')
  })
})

describe('Short', () => {
  it('should render the short date component correctly', () => {
    cy.visit('/iframe.html?id=forms-date--fielddate-short-format')
    cy.get('#root').should('be.visible').compareSnapshot('short')
  })
})

describe('Reduced', () => {
  it('should render the reduced date component correctly', () => {
    cy.visit('/iframe.html?id=forms-date--fielddate-reduced')
    cy.get('#root').should('be.visible').compareSnapshot('reduced')
  })
})

describe('IE11', () => {
  it('should render the ie11 date component correctly', () => {
    cy.visit('/iframe.html?id=forms-date--fielddate-ie-11')
    cy.get('#root').should('be.visible').compareSnapshot('ie11')
  })
})
