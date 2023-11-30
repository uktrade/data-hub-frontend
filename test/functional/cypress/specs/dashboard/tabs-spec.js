const urls = require('../../../../../src/lib/urls')

const LOCAL_STORAGE_KEY = 'dashboard-tab'

describe('Selecting a dashboard tab based on localstorage when the advisers has tasks', () => {
  before(() => cy.clearLocalStorage())
  after(() => cy.clearLocalStorage())

  const assertTabSelected = (tabIndex) => {
    cy.get('[data-test="tablist"] button')
      .eq(tabIndex)
      .should('have.attr', 'aria-selected', 'true')
  }

  context('My tasks', () => {
    const COMPANY_LISTS = 0
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.myTasks())
      cy.visit(urls.dashboard.myTasks())
      assertTabSelected(COMPANY_LISTS)
    })
  })

  context('Company lists', () => {
    const COMPANY_LISTS = 1
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.index())
      cy.visit(urls.dashboard.index())
      assertTabSelected(COMPANY_LISTS)
    })
  })

  context('Investment projects', () => {
    const INVESTMENT_PROJECTS = 2
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.investmentProjects())
      cy.visit(urls.dashboard.index())
      assertTabSelected(INVESTMENT_PROJECTS)
    })
  })

  context('Export projects', () => {
    const EXPORT_PROJECTS = 3
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.exportPipeline.index())
      cy.visit(urls.dashboard.index())
      assertTabSelected(EXPORT_PROJECTS)
    })
  })

  context('Referrals', () => {
    const MY_REFERRALS = 4
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.companies.referrals.list())
      cy.visit(urls.dashboard.index())
      assertTabSelected(MY_REFERRALS)
    })
  })
})
