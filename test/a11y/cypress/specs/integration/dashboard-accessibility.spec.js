describe('Dashboard', () => {
  before(() => {
    cy.visit('/')
    // Wait until page has loaded first
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.runA11y()
  })
})
