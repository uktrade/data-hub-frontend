const fixtures = require('../../fixtures')

const {
  companyAddRemoveFromLists: { cancelLink },
} = require('../../../../selectors')

const testTab = (tabText, index) => {
  it(`should return to the tab ${tabText}`, () => {
    cy.get(`#tab-${index}`).contains(tabText).click()
    cy.contains('View options').click()
    cy.contains('Add to or remove from lists').click()
    cy.get(cancelLink).click()

    cy.get(`#tab-${index}`).contains(tabText)
  })
}

describe('Company tab history', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}`)
  })
  ;[
    'Activity',
    'Company contacts',
    'Lead adviser',
    'Investment',
    'Export',
    'Orders',
  ].forEach(testTab)
})
