describe('Dashboard - feature flag', () => {
  after(() => {
    cy.resetUser()
    cy.resetFeatureFlags()
  })

  context('when a feature flag is set and you are in the testing team', () => {
    before(() => {
      cy.resetUser()
      cy.setUserDitTeam('1234')
      cy.resetFeatureFlags()
      cy.setFeatureFlag('layoutTesting:1234', true)
      cy.visit('/')
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
    'when you are in one of multiple teams that have the feature flag enabled',
    () => {
      before(() => {
        cy.resetUser()
        cy.setUserDitTeam('4567')
        cy.resetFeatureFlags()
        cy.setFeatureFlag('layoutTesting:1234', true)
        cy.setFeatureFlag('layoutTesting:4567', true)
        cy.setFeatureFlag('layoutTesting:7890', true)
        cy.visit('/')
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
    }
  )

  context(
    'when a feature flag is set and you are NOT in the testing team',
    () => {
      before(() => {
        cy.resetUser()
        cy.setUserDitTeam('4567')
        cy.resetFeatureFlags()
        cy.setFeatureFlag('layoutTesting:1234', true)
        cy.visit('/')
      })
      it('should show the default dashboard layout', () => {
        cy.get('[data-test="dashboard"]').should('not.exist')
      })
      it('should NOT append a query param for GA tracking', () => {
        cy.url('[data-test="dashboard"]').should(
          'not.contain',
          '?layoutTesting=dashboard'
        )
      })
    }
  )

  context('when a feature flag is set and you are NOT in any team', () => {
    before(() => {
      cy.resetUser()
      cy.setUserDitTeam(null)
      cy.resetFeatureFlags()
      cy.setFeatureFlag('layoutTesting:1234', true)
      cy.visit('/')
    })
    it('should show the default dashboard layout', () => {
      cy.get('[data-test="dashboard"]').should('not.exist')
    })
    it('should NOT append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'not.contain',
        '?layoutTesting=dashboard'
      )
    })
  })

  context('when there is no feature flag', () => {
    before(() => {
      cy.resetUser()
      cy.resetFeatureFlags()
      cy.visit('/')
    })
    it('should show the default dashboard layout', () => {
      cy.get('[data-test="dashboard"]').should('not.exist')
    })
    it('should NOT append a query param for GA tracking', () => {
      cy.url('[data-test="dashboard"]').should(
        'not.contain',
        '?layoutTesting=dashboard'
      )
    })
  })

  context('when a user has the personalised-dashboard feature flag set', () => {
    before(() => {
      cy.resetUser()
      cy.resetFeatureFlags()
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
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
})
