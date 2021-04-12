import { investmentProjectFaker } from '../../fakers/investment-projects'

describe('Dashboard - Investment project stages', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: 5,
        results: [
          {
            id: '1',
            name: 'Prospect',
          },
          {
            id: '2',
            name: 'Assign PM',
          },
          {
            id: '3',
            name: 'Active',
          },
          {
            id: '4',
            name: 'Verify win',
          },
          {
            id: '5',
            name: 'Won',
          },
        ].map((stage) => investmentProjectFaker({ stage })),
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] span:first-child button').click()
  })

  it('should contain stages for each project', () => {
    const expected = ['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']

    cy.get('[data-test="project-stage-tag"]').each(($el, i) => {
      return expect($el.text()).to.equal(expected[i])
    })
    cy.get('[aria-label~="project"]').each(($el) =>
      expect($el.attr('aria-label')).to.equal('project stage')
    )
  })
})
