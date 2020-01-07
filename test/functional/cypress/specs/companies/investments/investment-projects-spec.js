const selectors = require('../../../../../selectors')
const fixtures = require('../../../fixtures')

const { oneListCorp } = fixtures.company

describe('Company Investments and Investment projects', () => {
  before(() => {
    cy.visit(`/companies/${oneListCorp.id}/investments/projects`)
  })

  context('when viewing the company header', () => {
    it('should display the "One List Corp" heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'One List Corp'
      )
    })
  })
})
