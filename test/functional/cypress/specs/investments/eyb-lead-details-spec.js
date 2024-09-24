const { investments } = require('../../../../../src/lib/urls')
const { eybLeadFaker } = require('../../fakers/eyb-lead')

const setup = (eybLead) => {
  cy.intercept('GET', `/api-proxy/v4/investment-lead/eyb/${eybLead.id}`, {
    statusCode: 200,
    body: project,
  }).as('getEYBLeadDetails')
  cy.visit(investments.eybLeads.editValue(eybLead.id).details)
  cy.wait('@getEYBLeadDetails')
}

describe('EYB lead details', () => {
  context('When viewing an EYB lead with all the details fields', () => {
    beforeEach(() => {
      const eybLeadWithValues = eybLeadFaker
      setup(eybLeadWithValues)
    })

    it('should render all the fields of the details table', () => {
      assertSummaryTable({
        dataTest: 'eyb-lead-details-table',
        content: {
          'Company name': 'Shah, Parker and Rees',
        },
      })
    })
  })
})
