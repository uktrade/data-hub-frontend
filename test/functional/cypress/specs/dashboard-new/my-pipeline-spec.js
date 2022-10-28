describe('Dashboard', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  describe('Tabs', () => {
    it('should display tabs in the right order', () => {
      cy.get('[data-test="dashboard-tabs"]')
        .should('exist')
        .find('[data-test="tablist"]')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 3)
        .first()
        .should('have.text', 'Investment projects')
        .next()
        .should('have.text', 'Company lists')
        .next()
        .should('have.text', 'Pipeline')
    })
  })
})
