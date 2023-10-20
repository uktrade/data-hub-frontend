describe('Default', () => {
  it('should render the default component correctly', () => {
    cy.visit('/iframe.html?id=badge--default')
    cy.get('#storybook-root').should('be.visible').compareSnapshot('default')
  })
})

describe('Custom border colour', () => {
  it('should render the custom border colour component correctly', () => {
    cy.visit('/iframe.html?id=badge--custom-border-colour')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('custom-border-colour')
  })
})

describe('Custom text colour', () => {
  it('should render the custom text colour component correctly', () => {
    cy.visit('/iframe.html?id=badge--custom-text-colour')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('custom-text-colour')
  })
})

describe('Custom font size', () => {
  it('should render the custom font size component correctly', () => {
    cy.visit('/iframe.html?id=badge--custom-font-size')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('custom-font-size')
  })
})

describe('HTML content', () => {
  it('should render the HTML content component correctly', () => {
    cy.visit('/iframe.html?id=badge--html-content')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('html-content')
  })
})
