const fixtures = require('../../fixtures')

const {
  companyAddRemoveFromLists: { addRemoveButton, cancelLink },
  tabbedLocalNav,
} = require('../../../../selectors')

const testTab = tabText => {
  it(`should return to the tab ${tabText}`, () => {
    cy.get(tabbedLocalNav().tabs)
      .contains(tabText)
      .click()
    cy.get(addRemoveButton).click()
    cy.get(cancelLink).click()
    cy.get(tabbedLocalNav().tabs)
      .contains(tabText)
      .should('have.class', 'govuk-tabs__tab--selected')
  })
}

describe('Company tab history', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}`)
  });
  [
    'Activity',
    'Company contacts',
    'Lead adviser',
    'Investment',
    'Export',
    'Orders',
  ].forEach(testTab)
})
