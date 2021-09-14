import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import { investmentProjectListFaker } from '../../fakers/investment-projects'

const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'

describe('Investment projects summary', () => {
  const investmentProjectSummary = investmentProjectSummaryFaker({
    minValue: 1,
  })
  const investmentProjects = investmentProjectListFaker(5)
  const projectCount = Object.entries(investmentProjectSummary)
    .map(([, stage]) => stage.value)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.intercept('POST', `/api-proxy/v3/search/investment_project`, {
      body: {
        count: 1,
        results: investmentProjects,
        summary: investmentProjectSummary,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="investment-project-summary-section"]').as(
      'investmentProjectsSummarySection'
    )
  })

  it('should display an "Investment projects summary" toggle', () => {
    cy.get('[data-test=toggle-section-button-content]').should(
      'contain',
      'Investment projects summary'
    )
  })

  it('should display an SVG representing a chart', () => {
    cy.get('[data-test="pie-chart"]').find('svg').should('exist')
  })

  it('should display the correct project count', () => {
    cy.get('[data-test="pie-chart"]')
      .should('contain', projectCount)
      .should('contain', 'Projects')
  })

  it('should display a chart legend of all the stages', () => {
    const { prospect, assign_pm, active, verify_win, won } =
      investmentProjectSummary
    cy.get('[data-test="pie-chart-legend-prospect"]')
      .should('contain', `Prospect (${prospect.value})`)
      .find('a')
      .should(
        'have.attr',
        'href',
        `/investments/projects?stage=${prospect.id}&adviser=${myAdviserId}`
      )
    cy.get('[data-test="pie-chart-legend-assign_pm"]')
      .should('contain', `Assign PM (${assign_pm.value})`)
      .find('a')
      .should(
        'have.attr',
        'href',
        `/investments/projects?stage=${assign_pm.id}&adviser=${myAdviserId}`
      )
    cy.get('[data-test="pie-chart-legend-active"]')
      .should('contain', `Active (${active.value})`)
      .find('a')
      .should(
        'have.attr',
        'href',
        `/investments/projects?stage=${active.id}&adviser=${myAdviserId}`
      )
    cy.get('[data-test="pie-chart-legend-verify_win"]')
      .should('contain', `Verify win (${verify_win.value})`)
      .find('a')
      .should(
        'have.attr',
        'href',
        `/investments/projects?stage=${verify_win.id}&adviser=${myAdviserId}`
      )
    cy.get('[data-test="pie-chart-legend-won"]')
      .should('contain', `Won (${won.value})`)
      .find('a')
      .should(
        'have.attr',
        'href',
        `/investments/projects?stage=${won.id}&adviser=${myAdviserId}`
      )
  })
})
