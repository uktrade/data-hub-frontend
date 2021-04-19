describe('Dashboard - feature flag', () => {
  after(() => {
    cy.resetUser()
  })

  context('when the user does not have the feature flag set', () => {
    before(() => {
      cy.resetUser()
      cy.visit('/')
    })
    it('should show the default dashboard layout', () => {
      cy.get('[data-test="dashboard"]').should('not.exist')
    })
    it('should NOT append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'not.contain',
        '?layoutTesting=personalised-dashboard'
      )
    })
  })

  context('when a user has the personalised-dashboard feature flag set', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
    })
    it('should show an alternative layout', () => {
      cy.get('[data-test="dashboard"]').should('be.visible')
    })
    it('should append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'contain',
        '?layoutTesting=personalised-dashboard'
      )
    })
  })
})
