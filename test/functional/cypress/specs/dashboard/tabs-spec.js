const urls = require('../../../../../src/lib/urls')

const LOCAL_STORAGE_KEY = 'dashboard-tab'

describe('Selecting a dashboard tab based on localstorage when the advisers has tasks', () => {
  beforeEach(() => {
    cy.intercept('/api-proxy/v4/search/task').as('taskLookup')
  })

  const visit = (url) => {
    cy.visit(url)
    cy.wait('@taskLookup')
  }

  const assertTabSelected = (tabIndex) => {
    cy.get('[data-test="tablist"] button')
      .eq(tabIndex)
      .should('have.attr', 'aria-selected', 'true')
  }

  context('My tasks', () => {
    const TASKS = 0
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.myTasks())
      visit(urls.dashboard.myTasks())
      assertTabSelected(TASKS)
    })

    it('should keep the query params on page refresh', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.myTasks())
      visit(`${urls.dashboard.myTasks()}?a=1&b=2`)
      assertTabSelected(TASKS)
      cy.reload()
      cy.location().should((loc) => {
        expect(loc.search).to.include('?a=1&b=2')
      })
    })
  })

  context('Company lists', () => {
    const COMPANY_LISTS = 1
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.index())
      visit(urls.dashboard.index())
      assertTabSelected(COMPANY_LISTS)
    })
  })

  context('Investment projects', () => {
    const INVESTMENT_PROJECTS = 2
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.dashboard.investmentProjects())
      visit(urls.dashboard.index())
      assertTabSelected(INVESTMENT_PROJECTS)
    })
  })

  context('Export projects', () => {
    const EXPORT_PROJECTS = 3
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.exportPipeline.index())
      visit(urls.dashboard.index())
      assertTabSelected(EXPORT_PROJECTS)
    })
  })

  context('Referrals', () => {
    const MY_REFERRALS = 4
    it('should select the tab', () => {
      cy.localStorage(LOCAL_STORAGE_KEY, urls.companies.referrals.list())
      visit(urls.dashboard.index())
      assertTabSelected(MY_REFERRALS)
    })
  })
})
