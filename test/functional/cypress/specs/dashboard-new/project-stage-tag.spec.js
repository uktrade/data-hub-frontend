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
        count: 10,
        results: [
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Won',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Prospect',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Assign PM',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Prospect',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Verify win',
            },
          }),
          investmentProjectFaker({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Prospect',
            },
          }),
        ],
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] span:first-child button').click()
  })

  it('should contain stages for each project', () => {
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

    cy.get('[data-test="project-stage-tag"]').each(($el, i) => {
      return expect($el.text()).to.equal(expected[i])
    })
    cy.get('[aria-label~="project"]').each(($el) =>
      expect($el.attr('aria-label')).to.equal('project stage')
    )
  })
})
