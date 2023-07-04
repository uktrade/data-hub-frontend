const urls = require('../../../../../src/lib/urls')

const LOCAL_STORAGE_KEY = 'dashboard-tab'

describe('Selecting a dashboard tab based on localstorage', () => {
  before(() => cy.clearLocalStorage())
  after(() => cy.clearLocalStorage())

  const assertTabSelected = (tabIndex) => {
    cy.get('[data-test="tablist"] button')
      .eq(tabIndex)
      .should('have.attr', 'aria-selected', 'true')
  }

  context('Investment projects', () => {
    const INVESTMENT_PROJECTS = 0
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard())
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit(urls.dashboard())
      assertTabSelected(INVESTMENT_PROJECTS)
    })
  })

  context('Company lists', () => {
    const COMPANY_LISTS = 1
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.companyLists.index())
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit(urls.dashboard())
      assertTabSelected(COMPANY_LISTS)
    })
  })

  context('Export projects', () => {
    const EXPORT_PROJECTS = 2
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.exportPipeline.index())
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit(urls.dashboard())
      assertTabSelected(EXPORT_PROJECTS)
    })
  })

  context('My referrals', () => {
    const MY_REFERRALS = 3
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.companies.referrals.list())
      cy.setUserFeatures(['personalised-dashboard'])
      cy.visit(urls.dashboard())
      assertTabSelected(MY_REFERRALS)
    })
  })
})
