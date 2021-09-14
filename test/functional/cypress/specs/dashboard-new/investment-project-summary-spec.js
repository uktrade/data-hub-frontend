import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import { investmentProjectListFaker } from '../../fakers/investment-projects'

describe('Investment projects summary', () => {
  const investmentProjectSummary = investmentProjectSummaryFaker()
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
    cy.get('[data-test="pie-chart-legend"]')
      .should('contain', `Prospect (${prospect.value})`)
      .should('contain', `Assign PM (${assign_pm.value})`)
      .should('contain', `Active (${active.value})`)
      .should('contain', `Verify win (${verify_win.value})`)
      .should('contain', `Won (${won.value})`)
  })
})
