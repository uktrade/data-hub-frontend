describe('Dashboard - Investment project status', () => {
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
  it('should contain statuses for each project', () => {
    const expected = [
      'Won',
      'Prospect',
      'Active',
      'Active',
      'Active',
      'Assign PM',
      'Active',
      'Prospect',
      'Verify win',
      'Prospect',
    ]

    cy.get('[data-test="project-status-tag"]').each(($el, i) =>
      expect($el.text()).to.equal(expected[i])
    )
    cy.get('[aria-label~="project"]').each(($el) =>
      expect($el.attr('aria-label')).to.equal('project status')
    )
  })
})
