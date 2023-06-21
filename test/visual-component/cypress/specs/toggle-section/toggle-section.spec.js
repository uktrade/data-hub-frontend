describe('ToggleSection', () => {
  it('should render the default single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--default-single')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('default-single')
  })
  it('should render the default multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--default-multiple')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('default-multi')
  })
  it('should render the no highlight single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--no-highlight-single')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('no-highlight-single')
  })
  it('should render the no highlight multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--no-highlight-multiple')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('no-highlight-multi')
  })
  it('should render the dashboard single toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--dashboard-single-with-badge')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('dashboard-single')
  })
  it('should render the dashboard multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--dashboard-multiple')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('dashboard-multi')
  })

  // Temporarily commenting out this test while Pippo looks into why it's
  // failing remotely but passes locally. The tests are run in docker
  // containers both locally and remotely, so in theory they should produce
  // the same results.

  // it('should render the filter single toggle section correctly', () => {
  //   cy.visit('/iframe.html?id=togglesection--filter-single')
  //   cy.get('#storybook-root')
  //     .should('be.visible')
  //     .compareSnapshot('filter-single')
  // })

  it('should render the filter multiple toggle section correctly', () => {
    cy.visit('/iframe.html?id=togglesection--filter-multiple')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('filter-multi')
  })
})
