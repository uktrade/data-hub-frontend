import { investmentProjectFaker } from '../../fakers/investment-projects'
import {
  INVESTMENT_PROJECT_STAGES_LIST,
  INVESTMENT_PROJECT_STATUSES_LIST,
} from '../../fakers/constants'
import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import {
  STAGE_ACTIVE,
  STAGE_ASSIGN_PM,
  STAGE_PROSPECT,
  STAGE_VERIFY_WIN,
  STAGE_WON,
} from '../../../../../src/client/modules/Investments/Projects/constants'

describe('Dashboard - Investment project tags', () => {
  const summary = investmentProjectSummaryFaker()

  after(() => {
    cy.resetUser()
  })

  it('should contain stage tags for each project', () => {
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: 5,
        results: INVESTMENT_PROJECT_STAGES_LIST.map((stage) =>
          investmentProjectFaker({ stage })
        ),
        summary,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] button').contains('Investment').click()
    const expected = [
      {
        label: STAGE_PROSPECT,
        background: 'rgb(219, 213, 233)',
        colour: 'rgb(61, 35, 117)',
      },
      {
        label: STAGE_ASSIGN_PM,
        background: 'rgb(246, 215, 210)',
        colour: 'rgb(148, 37, 20)',
      },
      {
        label: STAGE_ACTIVE,
        background: 'rgb(210, 226, 241)',
        colour: 'rgb(20, 78, 129)',
      },
      {
        label: STAGE_VERIFY_WIN,
        background: 'rgb(255, 247, 191)',
        colour: 'rgb(89, 77, 0)',
      },
      {
        label: STAGE_WON,
        background: 'rgb(204, 226, 216)',
        colour: 'rgb(0, 90, 48)',
      },
    ]

    cy.get('[data-test="project-stage-tag"]').each(($el, i) => {
      const el = cy.wrap($el)
      el.should('have.text', expected[i].label)
      el.should('have.attr', 'aria-label', 'project stage')
      el.should('have.css', 'background-color', expected[i].background)
      el.should('have.css', 'color', expected[i].colour)
    })
  })

  it('should contain status tags for each project', () => {
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: 5,
        results: INVESTMENT_PROJECT_STATUSES_LIST.map((status) =>
          investmentProjectFaker({ status })
        ),
        summary,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] button').contains('Investment').click()
    const expected = ['ongoing', 'delayed', 'abandoned', 'lost', 'dormant']

    cy.get('[data-test="project-status-tag"]').each(($el, i) => {
      const el = cy.wrap($el)
      el.should('have.text', expected[i])
      el.should('have.attr', 'aria-label', 'project status')
    })
  })
})
