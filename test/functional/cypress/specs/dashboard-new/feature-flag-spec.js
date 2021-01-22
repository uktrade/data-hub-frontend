describe('Dashboard - feature flag', () => {
  context('when a feature flag is set and your are in the testing team', () => {
    beforeEach(() => {
      cy.setUserDitTeam('1234')
      cy.setFeatureFlag('layoutTesting:1234', true)
      cy.visit('/')
    })
    afterEach(() => {
      cy.resetUserDitTeam()
    })
    it('should show an alternative layout', () => {
      cy.get('[data-test="dashboard"]').should('be.visible')
    })
    it('should append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'contain',
        '?layoutTesting=dashboard'
      )
    })
  })

  context(
    'when a feature flag is set and your are NOT in the testing team',
    () => {
      beforeEach(() => {
        cy.setFeatureFlag('layoutTesting:1234', true)
        cy.visit('/')
      })
      it('should show the default dashboard layout', () => {
        cy.get('[data-test="dashboard"]').should('not.be.visible')
      })
      it('should NOT append a query param for GA tracking', () => {
        cy.url('[data-test="dashboard"]').should(
          'not.contain',
          '?layoutTesting=dashboard'
        )
      })
    }
  )

  context('when a feature flag is set and your are NOT in any team', () => {
    beforeEach(() => {
      cy.setUserDitTeam(null)
      cy.setFeatureFlag('layoutTesting:1234', true)
      cy.visit('/')
    })
    it('should show the default dashboard layout', () => {
      cy.get('[data-test="dashboard"]').should('not.be.visible')
    })
    it('should NOT append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'not.contain',
        '?layoutTesting=dashboard'
      )
    })
  })

  context('when there is no feature flag', () => {
    beforeEach(() => {
      cy.resetUserDitTeam()
      cy.resetFeatureFlags()
      cy.visit('/')
    })
    it('should show the default dashboard layout', () => {
      cy.get('[data-test="dashboard"]').should('not.be.visible')
    })
    it('should NOT append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'not.contain',
        '?layoutTesting=dashboard'
      )
    })
  })
})
