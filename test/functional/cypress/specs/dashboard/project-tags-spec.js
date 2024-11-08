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
import { rgb } from '../../../../../src/client/utils/colours'

describe('Dashboard - Investment project tags', () => {
  const summary = investmentProjectSummaryFaker()

  afterEach(() => {
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
        colour: rgb('#491644'),
        backgroundColour: rgb('#efdfed'),
      },
      {
        label: STAGE_ASSIGN_PM,
        colour: rgb('#2a0b06'),
        backgroundColour: rgb('#f4cdc6'),
      },
      {
        label: STAGE_ACTIVE,
        colour: rgb('#0c2d4a'),
        backgroundColour: rgb('#bbd4ea'),
      },
      {
        label: STAGE_VERIFY_WIN,
        colour: rgb('#594d00'),
        backgroundColour: rgb('#fff7bf'),
      },
      {
        label: STAGE_WON,
        colour: rgb('#005a30'),
        backgroundColour: rgb('#cce2d8'),
      },
    ]

    cy.get('[data-test="project-stage-tag"]').each(($el, i) => {
      const el = cy.wrap($el)
      el.should('have.text', expected[i].label)
      el.should('have.attr', 'aria-label', 'project stage')
      el.should('have.css', 'color', expected[i].colour)
      el.should('have.css', 'background-color', expected[i].backgroundColour)
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
    const expected = ['Ongoing', 'Delayed', 'Abandoned', 'Lost', 'Dormant']

    cy.get('[data-test="project-status-tag"]').each(($el, i) => {
      const el = cy.wrap($el)
      el.should('have.text', expected[i])
      el.should('have.attr', 'aria-label', 'project status')
    })
  })
})
