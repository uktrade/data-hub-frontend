import { investmentProjectFaker } from '../../fakers/investment-projects'
import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'

describe('Dashboard timeline', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    const project = investmentProjectFaker({
      stage: INVESTMENT_PROJECT_STAGES.active,
    })
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: 1,
        results: [project],
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')

    // If the user is an ITA (as in these tests) the UI redirects
    // the user from / to /export. Therefore, we have to select the
    // "Investment projects" tab before testing
    cy.get('[data-test="tablist"]').contains('Investment projects').click()
  })

  after(() => {
    cy.resetUser()
  })

  it('should contain timeline stages', () => {
    cy.get('[data-test="timeline"]')
      .eq(0)
      .should('have.text', 'ProspectAssign PMActiveVerify winWon')
  })

  it('should indicate a current stage', () => {
    const expected = [
      'stage complete',
      'stage complete',
      'stage complete',
      'stage incomplete',
      'stage incomplete',
    ]
    cy.get('[data-test="timeline"]')
      .eq(0)
      .find('li')
      .each(($el, i) => {
        expect($el.attr('aria-label')).to.equal(expected[i])
      })
  })
})
