const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Lead advisers', () => {
  context('when viewing a non One List tier company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}`)
      cy.get(selectors.tabbedLocalNav().item(3)).click()
    })
    it('should display the "Lead Advisers" tab in the navigation', () => {
      cy.get(selectors.tabbedLocalNav().item(3)).should('contain', 'Lead Adviser')
    })
    it('should display a header with the company name', () => {
      cy.get(selectors.companyLeadAdviser.header).should('have.text', 'Lead ITA for Lambda plc')
    })
    it('should display a button to add myself as lead adviser', () => {
      cy.contains('Add myself as Lead ITA').invoke('attr', 'href').should('eq', `/companies/${fixtures.company.lambdaPlc.id}/advisers/confirm`)
    })
  })
  context('when viewing a One List Tier company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}`)
    })
    it('should display the "Core team" tab in the navigation', () => {
      cy.get(selectors.tabbedLocalNav().item(3)).should('contain', 'Core team')
    })
  })
})
