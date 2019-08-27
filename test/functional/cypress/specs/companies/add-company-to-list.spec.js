const selectors = require('../../selectors')
const fixtures = require('../../fixtures')

describe('Add company to list', () => {
  context('when a company is already added to the users company list', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/activity`)
    })
    it('should render a button to add a company to the user list', () => {
      cy.get(selectors.companyAddToListButton.button).should('have.text', 'Remove from my list')
    })
  })
  context('when a company is not added to the users company list', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}/activity`)
    })
    it('should render a button to add a company to the user list', () => {
      cy.get(selectors.companyAddToListButton.button).should('have.text', 'Add to my list')
    })
  })
  context('when a company is archived', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/activity`)
    })
    it('should not render a button for adding a company to a user list', () => {
      cy.get(selectors.companyAddToListButton.button).should('have.text', 'Remove from my list')
      cy.get(selectors.companyAddToListButton.button).should('not.have.text', 'Add to my list')
    })
  })
})
