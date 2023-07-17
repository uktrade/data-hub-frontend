describe('Dashboard', () => {
  context('Tabs - default', () => {
    before(() => {
      cy.visit('/')
    })

    after(() => {
      cy.resetUser()
    })

    it('should display tabs in the right order', () => {
      cy.get('[data-test="dashboard-tabs"]')
        .should('exist')
        .find('[data-test="tablist"]')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 4)
        .first()
        .should('have.text', 'Company lists')
        .next()
        .should('have.text', 'Investment projects')
        .next()
        .should('have.text', 'Export projects')
        .next()
        .should('have.text', 'Referrals')
    })
  })

  context('Tabs - Export', () => {
    before(() => {
      cy.visit('/')
    })

    after(() => {
      cy.resetUser()
    })

    it('should display tabs in the right order', () => {
      cy.get('[data-test="dashboard-tabs"]')
        .should('exist')
        .find('[data-test="tablist"]')
        .eq(0)
        .should('exist')
        .children()
        .should('have.length', 4)
        .first()
        .should('have.text', 'Company lists')
        .next()
        .should('have.text', 'Investment projects')
        .next()
        .should('have.text', 'Export projects')
        .next()
        .should('have.text', 'Referrals')
    })
  })
})
