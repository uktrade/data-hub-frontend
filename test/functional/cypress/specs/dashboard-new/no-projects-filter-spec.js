describe('Dashboard - no investment projects', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="tabpanel"]').find('select').eq(0).as('stageSelect')
  })

  context('When a filter is applied and there are zero projects', () => {
    it('should display "No investment projects"', () => {
      cy.get('@stageSelect')
        .select('Verify win')
        .get('[data-test="tabpanel"] p')
        .should('have.text', 'No investment projects')
    })
  })
})
