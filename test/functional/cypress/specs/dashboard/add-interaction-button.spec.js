describe('Dashboard - My projects list', () => {
  beforeEach(() => {
    cy.setFeatureFlag(
      'layoutTesting:9010dd28-9798-e211-a939-e4115bead28a',
      true
    )
    cy.visit('/')
    cy.get('[data-test="tablist"] span:first-child button').click()
  })
  after(() => {
    cy.resetFeatureFlags()
  })
  it('should contain a button to add an interaction', () => {
    cy.get('[data-test="my-projects-list-item"] > a')
      .as('addInteractionLink')
      .eq(0)
      .should('have.text', 'Add interaction')

    cy.get('@addInteractionLink').should(
      'have.attr',
      'href',
      '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/interactions/create'
    )
  })
})
