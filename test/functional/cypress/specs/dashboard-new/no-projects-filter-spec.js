describe('Dashboard - no investment projects', () => {
  beforeEach(() => {
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/')
    cy.get('[data-test="tabpanel"]').find('select').eq(0).as('stageSelect')
  })
  after(() => {
    cy.resetFeatureFlags()
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
