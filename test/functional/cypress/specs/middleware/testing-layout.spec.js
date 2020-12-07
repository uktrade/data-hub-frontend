describe('Testing layout feature flag', () => {
  context(
    'when I am in the team and "testingLayout" feature flag is turned on',
    () => {
      beforeEach(() => {
        cy.setFeatureFlag(
          'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
          true
        )
        cy.visit('/layout-testing')
      })
      it('should display a test layout', () => {
        cy.get('body').should('have.text', 'Testing layout is true')
      })
      it('should include the query param for GA tracking', () => {
        cy.url().should('contain', '?layoutTesting=testing')
      })
      after(() => {
        cy.resetFeatureFlags()
      })
    }
  )
  context(
    'when I am NOT in the team and "testingLayout" feature flag is turned on',
    () => {
      beforeEach(() => {
        cy.setFeatureFlag('layoutTesting:123456', true)
        cy.visit('/layout-testing')
      })
      it('should display a normal layout', () => {
        cy.get('body').should('have.text', 'Testing layout is false')
      })
      it('should not contain any query params in the url', () => {
        cy.url().should('eq', `${Cypress.config().baseUrl}/layout-testing`)
      })
      after(() => {
        cy.resetFeatureFlags()
      })
    }
  )

  context('when "testingLayout" feature flag is turned off', () => {
    beforeEach(() => {
      cy.visit('/layout-testing')
    })
    it('should display a normal layout', () => {
      cy.get('body').should('have.text', 'Testing layout is false')
    })
    it('should not contain any query params in the url', () => {
      cy.url().should('eq', `${Cypress.config().baseUrl}/layout-testing`)
    })
  })
})
