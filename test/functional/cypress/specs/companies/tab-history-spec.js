const fixtures = require('../../fixtures')

const {
  companyAddRemoveFromLists: { cancelLink },
} = require('../../../../selectors')

const testTab = (tabText) => {
  const lookUp = {
    Activity: 'tab-activity',
    'Business details': 'tab-business-details',
    'Company contacts': 'tab-contacts',
    'Lead adviser': 'tab-advisers',
    Investment: 'tab-investments',
    Export: 'tab-exports',
    Orders: 'tab-orders',
  }
  const tab = lookUp[tabText]
  it(`should return to the tab ${tabText}`, () => {
    cy.get(`#${tab}`).contains(tabText).click()
    cy.contains('View options').click()
    cy.contains('Add to or remove from lists').click()
    cy.get(cancelLink).click()

    cy.get(`#${tab}`).contains(tabText)
  })
}

describe('Company tab history', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}`)
  })
  ;[
    'Activity',
    'Business details',
    'Company contacts',
    'Lead adviser',
    'Investment',
    'Export',
    'Orders',
  ].forEach(testTab)
})
