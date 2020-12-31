describe('Default', () => {
  it('should render the default component correctly', () => {
    cy.visit('/iframe.html?id=badge--default')
    cy.get('#root').should('be.visible').compareSnapshot('default')
  })
})

describe('Custom colour', () => {
  it('should render the custom colour component correctly', () => {
    cy.visit('/iframe.html?id=badge--custom-colour')
    cy.get('#root').should('be.visible').compareSnapshot('custom-colour')
  })
})

describe('HTML content', () => {
  it('should render the HTML content component correctly', () => {
    cy.visit('/iframe.html?id=badge--html-content')
    cy.get('#root').should('be.visible').compareSnapshot('html-content')
  })
})
