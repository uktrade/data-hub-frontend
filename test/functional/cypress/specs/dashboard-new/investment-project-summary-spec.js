import { INVESTMENT_PROJECT_STAGES_LIST } from '../../fakers/constants'
import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import { investmentProjectListFaker } from '../../fakers/investment-projects'

// Adviser id is currently set in the node layer, so we have to set to the
// value in sandbox
const MY_ADVISER_ID = '7d19d407-9aec-4d06-b190-d3f404627f21'

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

  context('Common elements to both Chart and Table views', () => {
    it('should display an "Investment projects summary" toggle', () => {
      cy.get('[data-test=toggle-section-button-content]').should(
        'contain',
        'Investment projects summary'
      )
    })

    it('should display a button to toggle the views', () => {
      cy.get('[data-test="toggle-views"]').should('exist')
    })
  })

  context('Chart view', () => {
    it('should display a button "Change to table and accessible view"', () => {
      cy.get('[data-test="toggle-views"]').should(
        'contain',
        'Change to table and accessible view'
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
      cy.get('[data-test="pie-chart"]')
        .should('contain', 'Prospect')
        .should('contain', 'Assign PM')
        .should('contain', 'Active')
        .should('contain', 'Verify win')
        .should('contain', 'Won')
    })
  })

  context('Table view', () => {
    before(() => {
      cy.get('[data-test="toggle-views"]').click()
    })

    it('should display a button "Change to chart view"', () => {
      cy.get('[data-test="toggle-views"]').should(
        'contain',
        'Change to chart view'
      )
    })

    it('should display project information within a blue box', () => {
      cy.get('[data-test="investment-project-total"]')
        .should('contain', projectCount)
        .should('contain', 'Projects')
    })

    it('should display a table with rows for each stage', () => {
      const table = [
        ['Stage', 'Projects'],
        ['Prospect', investmentProjectSummary.prospect.value],
        ['Assign PM', investmentProjectSummary.assign_pm.value],
        ['Active', investmentProjectSummary.active.value],
        ['Verify win', investmentProjectSummary.verify_win.value],
        ['Won', investmentProjectSummary.won.value],
      ]
      cy.get('[data-test="investment-project-table"]')
        .find('tr')
        .each((el, row) => {
          cy.wrap(el)
            .children()
            .each((el, col) => {
              cy.wrap(el).should('contain', table[row][col])
            })
        })
    })

    it('should have hyperlinks for each stage', () => {
      const IDS = INVESTMENT_PROJECT_STAGES_LIST.map((stage) => stage.id)
      const TITLES = [
        'View Prospect',
        'View Assign PM',
        'View Active',
        'View Verify win',
        'View Won',
      ]
      cy.get('[data-test="investment-project-table"]')
        .find('a')
        .should('have.length', 5)
        .each((el, i) => {
          cy.wrap(el)
            .should(
              'have.attr',
              'href',
              `/investments/projects?stage=${IDS[i]}&adviser=${MY_ADVISER_ID}`
            )
            .should('have.attr', 'title', TITLES[i])
        })
    })
  })
})
