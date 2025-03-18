const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')
const {
  assertLocalNav,
  assertLocalReactNav,
  assertActivitytab,
} = require('../../support/assertions')

describe('DBT Permission', () => {
  describe('dashboard', () => {
    beforeEach(() => {
      cy.visit(urls.dashboard.index())
    })

    it('should display CRM Community in the Datahub Bar', () => {
      cy.get('[data-test="crm-community-link"]').should('be.visible')
    })

    it('should display DBT only header nav links', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Events',
        'Interactions',
        'Investments',
        'Orders',
        'Market access',
        'Support',
      ])
    })

    it('should display all five dashboard tabs', () => {
      cy.get('[role="tab"]').as('tabItems')
      assertLocalNav('@tabItems', [
        'Tasks',
        'Company lists',
        'Investment projects',
        'Export projects',
        'Referrals',
      ])
    })
  })

  describe('activity', () => {
    const company = fixtures.company.create.corp()

    beforeEach(() => {
      cy.loadFixture([company])
      cy.visit(urls.companies.detail(company.pk))
    })

    it('should display DBT only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Overview',
        'Activity',
        'Details',
        'Contacts',
        'Files',
        'Account management',
        'Investment',
        'Export',
        'Orders',
      ])
    })
    //TODO - Unskip when the internal activity filter has been restored
    it.skip('when on the activity tab, internal activity should be selected', () => {
      cy.get('[data-test="tabbedLocalNavList"]').contains('Activity').click()
      assertActivitytab('#field-activityType-1')
    })
  })

  describe('contact', () => {
    const company = fixtures.company.create.defaultCompany('local nav testing')
    const contact = fixtures.contact.create(company.pk)

    beforeEach(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(urls.contacts.contact(contact.pk))
    })

    it('should display DBT only side navs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
        'Details',
        'Activity',
        'Audit history',
      ])
    })
  })

  describe('investment', () => {
    beforeEach(() => {
      const investmentProject = fixtures.investmentProject.create.newHotelFdi()
      cy.loadFixture([investmentProject])
      cy.visit(urls.investments.projects.details(investmentProject.pk))
    })

    it('should display DBT only side navs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
        'Project details',
        'Project team',
        'Tasks',
        'Interactions',
        'Evaluations',
        'Propositions',
        'Edit history',
        'Evidence',
      ])
    })
  })
})
