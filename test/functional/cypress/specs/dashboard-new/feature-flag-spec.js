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
  })

  context('when a user has the personalised-dashboard feature flag set', () => {
    before(() => {
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit('/')
    })

    it('should show an alternative layout', () => {
      cy.get('[data-test="dashboard"]').should('be.visible')
    })

    it('should write to the GTM data layer', () => {
      cy.window().then((win) => {
        const data = win.dataLayer.find(
          ({ name }) => name === 'personalised-dashboard'
        )
        expect(data).to.deep.equal({
          name: 'personalised-dashboard',
          event: 'featureFlag',
        })
      })
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
  })
})
