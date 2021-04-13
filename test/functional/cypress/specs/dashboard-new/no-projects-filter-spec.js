import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'
import { investmentProjectListFaker } from '../../fakers/investment-projects'

describe('Dashboard - no investment projects', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="tabpanel"]').find('select').eq(0).as('stageSelect')
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', (req) => {
      req.reply(
        req.body.stage === INVESTMENT_PROJECT_STAGES.verifyWin.id
          ? { body: { count: 0, results: [] } }
          : {
              body: {
                count: 10,
                results: investmentProjectListFaker(10),
              },
            }
      )
    }).as('apiRequest')
    cy.visit('/myinvestmentprojects')
    cy.wait('@apiRequest')

    cy.get('[data-test="tabpanel"]').find('select').eq(0).as('stageSelect')
  })

  context('When a filter is applied and there are zero projects', () => {
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
