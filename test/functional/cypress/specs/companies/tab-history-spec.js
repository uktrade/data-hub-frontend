const fixtures = require('../../fixtures')

const {
  companyAddRemoveFromLists: { cancelLink },
} = require('../../../../selectors')

const testTab = (tabText) => {
  const lookUp = {
    Overview: 'tab-overview',
    Activity: 'tab-activity',
    'Business details': 'tab-business-details',
    Contacts: 'tab-contacts',
    'Account management': 'tab-account-management',
    Investment: 'tab-investments',
    Export: 'tab-exports',
    Orders: 'tab-orders',
  }
  const tab = lookUp[tabText]
  it(`should return to the tab ${tabText}`, () => {
    cy.get(`#${tab}`).contains(tabText).click()
    cy.get('[data-test="add-to-list-button"]').contains('+ Add to list').click()
    cy.get(cancelLink).click()

    cy.get(`#${tab}`).contains(tabText)
  })
}

describe('Company tab history', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.company.marsExportsLtd.id}`)
  })
  ;[
    'Overview',
    'Activity',
    'Business details',
    'Contacts',
    'Account management',
    'Investment',
    'Export',
    'Orders',
  ].forEach(testTab)
})
