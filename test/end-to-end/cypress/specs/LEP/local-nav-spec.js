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

    before(() => {
      cy.loadFixture([company])
      cy.visit(urls.companies.detail(company.pk))
    })

    it('should not display Market Access in the Datahub Bar', () => {
      cy.get('[data-test="market-access-link"]').should('not.exist')
    })

    it('should display LEP only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Overview',
        'Contacts',
        'Business details',
        'Account management',
        'Investment',
      ])
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit(urls.dashboard.index())
    })

    it('should display LEP only tabs', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Investments',
        'Community',
        'Support',
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
      assertLocalNav(selectors.nav.sideNav, [
        'Project details',
        'Project team',
        'Interactions',
        'Evaluations',
        'Propositions',
        'Edit history',
        'Evidence',
      ])
    })
  })
})
