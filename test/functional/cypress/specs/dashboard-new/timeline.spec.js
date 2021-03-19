describe('Dashboard timeline', () => {
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
  it('should contain timeline stages', () => {
    cy.get('[data-test="timeline"]')
      .eq(0)
      .should('have.text', 'ProspectAssign PMActiveVerify winWon')
  })
  it('should indicate a current stage', () => {
    const expected = [
      'stage complete',
      'stage incomplete',
      'stage incomplete',
      'stage incomplete',
      'stage incomplete',
    ]
    cy.get('[data-test="timeline"]')
      .eq(1)
      .find('li')
      .each(($el, i) => {
        expect($el.attr('aria-label')).to.equal(expected[i])
      })
  })
})
