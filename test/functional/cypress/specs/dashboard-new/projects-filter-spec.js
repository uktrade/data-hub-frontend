import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'
import { investmentProjectListFaker } from '../../fakers/investment-projects'
import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'
import { assertPayload } from '../../support/assertions'

const getFinancialYearStart = (date) =>
  date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear()

const myAdviser = {
  id: '7d19d407-9aec-4d06-b190-d3f404627f21',
  name: 'Barry Oling',
}
const prospectStageId = '8a320cc9-ae2e-443e-9d26-2f36452c2ced'
const ongoingStatusId = 'ongoing'

const minimumPayload = {
  adviser: myAdviser.id,
  limit: 10,
  offset: 0,
  sortby: 'created_on:desc',
  show_summary: true,
}

describe('Dashboard - my projects list filters', () => {
  const summary = investmentProjectSummaryFaker()

  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
  })

  after(() => {
    cy.resetUser()
  })

  context('When a filter is applied and there are zero projects', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/investment_project', (req) => {
        req.reply(
          req.body.stage === INVESTMENT_PROJECT_STAGES.verifyWin.id
            ? { body: { count: 0, results: [], summary } }
            : {
                body: {
                  count: 10,
                  results: investmentProjectListFaker(10),
                  summary,
                },
              }
        )
      }).as('apiRequest')
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    it('should display "No investment projects"', () => {
      cy.get('[data-test="stage-select"] select').select('Verify win')
      cy.wait('@apiRequest')

      cy.get('[data-test="tabpanel"] p').should(
        'have.text',
        'No investment projects'
      )
    })
  })

  context('When filters are applied', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v3/search/investment_project').as(
        'apiRequest'
      )
      cy.visit('/')
      cy.wait('@apiRequest')
    })

    it('should filter by stage', () => {
      cy.get('[data-test="stage-select"] select').select('Prospect')
      cy.wait('@apiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        stage: prospectStageId,
      })
    })

    it('should filter by status', () => {
      cy.get('[data-test="status-select"] select').select('Ongoing')
      cy.wait('@apiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        status: ongoingStatusId,
      })
    })

    it('should filter by land date', () => {
      cy.wait('@apiRequest')
      const financialYearStart = getFinancialYearStart(new Date()).toString()
      cy.get('[data-test="land-date-select"] select').select(financialYearStart)
      assertPayload('@apiRequest', {
        ...minimumPayload,
        financial_year_start: [financialYearStart],
      })
    })
  })
})
