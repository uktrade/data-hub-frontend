import { investmentProjectsFactory } from '../../factories'

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
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Won',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Prospect',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Assign PM',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Active',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Prospect',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Verify win',
            },
          })[0],
          investmentProjectsFactory({
            stage: {
              id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
              name: 'Prospect',
            },
          })[0],
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
