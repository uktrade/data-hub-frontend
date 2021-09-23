import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'
import { investmentProjectListFaker } from '../../fakers/investment-projects'
import { investmentProjectSummaryFaker } from '../../fakers/investment-project-summary'

describe('Dashboard - no investment projects', () => {
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

      cy.get('[data-test="tabpanel"]').find('select').eq(0).as('stageSelect')
    })

    it('should display "No investment projects"', () => {
      cy.get('@stageSelect').select('Verify win')
      cy.wait('@apiRequest')

      cy.get('[data-test="tabpanel"] p').should(
        'have.text',
        'No investment projects'
      )
    })
  })
})
