const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalNav,
  assertLocalReactNav,
} = require('../../support/assertions')

describe('DA Permission', () => {
  describe('activity', () => {
    const company = fixtures.company.create.corp()

    before(() => {
      cy.loadFixture([company])
      cy.visit(urls.companies.detail(company.pk))
    })

    it('should display DA only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Overview',
        'Contacts',
        'Details',
        'Files',
        'Account management',
        'Investment',
        'Orders',
      ])
    })
  })

  describe('dashboard', () => {
    beforeEach(() => {
      cy.visit(urls.dashboard.investmentProjects())
    })

    it('should display CRM Community in the Datahub Bar', () => {
      cy.get('[data-test="crm-community-link"]').should('be.visible')
    })

    it('should display DA only header tabs', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Files',
        'Investments',
        'Orders',
        'Market access',
        'Support',
      ])
    })

    it('should display DA only dashboard tabs', () => {
      cy.get('[role="tab"]').as('tabItems')
      assertLocalNav('@tabItems', [
        'Tasks',
        'Investment projects',
        'Export projects',
      ])
    })
  })

  describe('contact details', () => {
    const company = fixtures.company.create.defaultCompany('local nav da')
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(urls.contacts.details(contact.pk))
    })

    it('should display DA only tabs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
        'Details',
        'Files',
        'Audit history',
      ])
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investmentProject.newGolfCourse.id
        )
      )
    })

    it('should display DA only tabs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
        'Project details',
        'Project team',
        'Tasks',
        'Files',
        'Interactions',
        'Evaluations',
        'Propositions',
        'Edit history',
        'Evidence',
      ])
    })
  })
})
