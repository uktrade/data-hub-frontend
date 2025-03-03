const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalNav,
  assertLocalReactNav,
} = require('../../support/assertions')

describe('LEP Permission', () => {
  describe('activity', () => {
    const company = fixtures.company.create.corp()

    beforeEach(() => {
      cy.loadFixture([company])
      cy.visit(urls.companies.detail(company.pk))
    })

    it('should display CRM Community in the Datahub Bar', () => {
      cy.get('[data-test="crm-community-link"]').should('be.visible')
    })

    it('should display LEP only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Overview',
        'Contacts',
        'Details',
        'Account management',
        'Investment',
      ])
    })
  })

  describe('dashboard', () => {
    beforeEach(() => {
      cy.visit(urls.dashboard.investmentProjects())
    })

    it('should display LEP only header tabs', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Investments',
        'Support',
      ])
    })

    it('should display LEP only dashboard tabs', () => {
      cy.get('[role="tab"]').as('tabItems')
      assertLocalNav('@tabItems', [
        'Tasks',
        'Investment projects',
        'Export projects',
      ])
    })
  })

  describe('contact details', () => {
    const company = fixtures.company.create.defaultCompany('local nav lep')
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(urls.contacts.details(contact.pk))
    })

    it('should display LEP only tabs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
        'Details',
        'Audit history',
      ])
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.details(fixtures.investmentProject.newZoo.id)
      )
    })

    it('should display LEP only tabs', () => {
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
