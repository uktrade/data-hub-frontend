describe('Feature flags middleware', () => {
  context('when there is a feature flag set', () => {
    before(() => {
      cy.setFeatureFlag('featureFlag', true)
      cy.visit('/testing/feature-flag')
    })
    it('should show a feature flag message', () => {
      cy.get('body').should('contain', 'Feature flag set')
    })
  })

  context('when there is no feature flag set', () => {
    before(() => {
      cy.resetFeatureFlags()
      cy.visit('/testing/feature-flag')
    })
    it('should not show a feature flag message', () => {
      cy.get('body').should('contain', 'No feature flag set')
    })
  })
})
