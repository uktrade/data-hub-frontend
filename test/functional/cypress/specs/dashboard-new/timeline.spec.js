import { investmentProjectFaker } from '../../fakers/investment-projects'

describe('Dashboard timeline', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    const project = investmentProjectFaker({
      stage: {
        id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
        name: 'Active',
      },
    })
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: 1,
        results: [project],
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] span:first-child button').click()
    cy.visit('/')
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
