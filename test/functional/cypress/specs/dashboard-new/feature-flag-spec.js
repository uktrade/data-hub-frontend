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
        '?featureTesting=personalised-dashboard'
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
        '?featureTesting=personalised-dashboard'
      )
    })
  })

  context('when a user navigates tabs with the feature flag set', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
      cy.get('[data-test="dashboard-tabs"] [data-test="tab-item"]')
        .eq(1)
        .click()
    })

    it('should show an alternative layout', () => {
      cy.get('[data-test="dashboard"]').should('be.visible')
    })

    it('should maintain the query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'contain',
        'company-lists?featureTesting=personalised-dashboard'
      )
    })
  })
})
