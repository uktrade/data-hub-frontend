import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import { investmentProjectListFaker } from '../../fakers/investment-projects'
import urls from '../../../../../src/lib/urls'

const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'

const getFinancialYearStart = (date) =>
  date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear()

describe('Investment projects summary', () => {
  const investmentProjectSummary = investmentProjectSummaryFaker({
    minValue: 1,
  })
  const investmentProjects = investmentProjectListFaker(5)
  const projectCount = Object.entries(investmentProjectSummary)
    .map(([, stage]) => stage.value)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  const { prospect, assign_pm, active, verify_win, won } =
    investmentProjectSummary

  beforeEach(() => {
    cy.resetUser()
    cy.intercept('POST', `/api-proxy/v3/search/investment_project`, {
      body: {
        count: 1,
        results: investmentProjects,
        summary: investmentProjectSummary,
      },
    }).as('apiRequest')
    cy.visit(urls.dashboard.investmentProjects())
    cy.wait('@apiRequest')
  })

  context('after initial load', () => {
    it('should display a chart', () => {
      cy.get('[data-test="pie-chart"]')
        .should('exist')
        .should('have.attr', 'aria-label', `${projectCount} Projects`)
    })

    it('should display the correct project count', () => {
      cy.get('[data-test="pie-chart"]')
        .should('contain', projectCount)
        .should('contain', 'Projects')
    })

    it('should display a chart legend of all the stages', () => {
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

  context('with filters applied', () => {
    it('should apply status and land date filters to links', () => {
      const financialYearStart = getFinancialYearStart(new Date()).toString()
      const query = `adviser=${myAdviserId}&land_date_financial_year_start[0]=${financialYearStart}&status=ongoing`
      cy.get('[data-test="land-date-select"] select').select(financialYearStart)
      cy.get('[data-test="status-select"] select').select('Ongoing')

      cy.wait('@apiRequest')

      cy.get('[data-test="pie-chart-legend-prospect"]')
        .find('a')
        .should(
          'have.attr',
          'href',
          `/investments/projects?stage=${prospect.id}&${query}`
        )
      cy.get('[data-test="pie-chart-legend-assign_pm"]')
        .find('a')
        .should(
          'have.attr',
          'href',
          `/investments/projects?stage=${assign_pm.id}&${query}`
        )
      cy.get('[data-test="pie-chart-legend-active"]')
        .find('a')
        .should(
          'have.attr',
          'href',
          `/investments/projects?stage=${active.id}&${query}`
        )
      cy.get('[data-test="pie-chart-legend-verify_win"]')
        .find('a')
        .should(
          'have.attr',
          'href',
          `/investments/projects?stage=${verify_win.id}&${query}`
        )
      cy.get('[data-test="pie-chart-legend-won"]')
        .find('a')
        .should(
          'have.attr',
          'href',
          `/investments/projects?stage=${won.id}&${query}`
        )
    })
  })
})
