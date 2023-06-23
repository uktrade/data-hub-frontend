describe('ToggleSection', () => {
  const retryOptions = {
    limit: 3,
    delay: 1000,
  }

  it('should render the default single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--default-single')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('default-single', 0, retryOptions)
  })
  it('should render the default multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--default-multiple')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('default-multi', 0, retryOptions)
  })
  it('should render the no highlight single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--no-highlight-single')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('no-highlight-single', 0, retryOptions)
  })
  it('should render the no highlight multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--no-highlight-multiple')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('no-highlight-multi', 0, retryOptions)
  })
  it('should render the dashboard single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--dashboard-single-with-badge')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('dashboard-single', 0, retryOptions)
  })
  it('should render the dashboard multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--dashboard-multiple')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('dashboard-multi', 0, retryOptions)
  })

  it('should render the filter single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--filter-single')

    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('filter-single', 0, retryOptions)
  })

  it('should render the filter multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--filter-multiple')
    cy.get('[data-test="toggle-section-button"] > img').should('be.visible')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('filter-multi', 0, retryOptions)
  })
})
