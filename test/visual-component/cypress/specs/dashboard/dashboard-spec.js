describe('No list', () => {
  it('should render the empty dashboard component correctly', () => {
    cy.visit('/iframe.html?id=dashboard--no-lists')
    cy.get('#root').should('be.visible').compareSnapshot('no-list')
  })
})

describe('One empty list', () => {
  it('should render the empty dashboard component correctly', () => {
    cy.visit('/iframe.html?id=dashboard--one-empty-list')
    cy.get('#root').should('be.visible').compareSnapshot('one-empty-list')
  })
})

describe('One full list', () => {
  it('should render the dashboard component correctly', () => {
    cy.visit('/iframe.html?id=dashboard--one-full-list')
    cy.get('#root').should('be.visible').compareSnapshot('one-full-list')
  })
})

describe('Three lists first empty', () => {
  it('should render the dashboard component correctly', () => {
    cy.visit('/iframe.html?id=dashboard--three-lists-first-empty')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('three-lists-first-empty')
  })
})

describe('Three lists first single company', () => {
  it('should render the dashboard component correctly', () => {
    cy.visit('/iframe.html?id=dashboard--three-lists-first-with-single-company')
    cy.get('#root')
      .should('be.visible')
      .compareSnapshot('three-lists-first-single')
  })
})

describe('Three lists', () => {
  it('should render the dashboard component correctly', () => {
    cy.visit('/iframe.html?id=dashboard--three-company-lists')
    cy.get('#root').should('be.visible').compareSnapshot('three-lists')
  })
})
