describe('Dashboard - Investment project status', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
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
