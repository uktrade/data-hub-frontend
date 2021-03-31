const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const {
  companies,
  contacts,
  dashboard,
  investments,
} = require('../../../../../src/lib/urls')

const { assertLocalNav } = require('../../support/assertions')

describe('DA Permission', () => {
  describe('activity', () => {
    const company = fixtures.company.create.corp()

    before(() => {
      cy.loadFixture([company])
      cy.visit(companies.detail(company))
    })

    it('should display DA only tabs', () => {
      assertLocalNav(selectors.tabbedLocalNav().tabs, [
        'Company contacts',
        'Core team',
        'Investment',
        'Orders',
      ])
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit(dashboard())
    })

    it('should display DA only tabs', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Investments',
        'Orders',
        'Market Access',
        'Support',
      ])
    })
  })

  describe('contact details', () => {
    const company = fixtures.company.create.defaultCompany('local nav da')
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(contacts.details(contact.pk))
    })

    it('should display DA only tabs', () => {
      assertLocalNav(selectors.nav.sideNav, ['Details', 'Audit history'])
    })
  })

  describe('investment projects', () => {
    investmentProjectNewGolf = fixtures.investmentProject.create.newGolfCourseDA()

    before(() => {
      cy.loadFixture([investmentProjectNewGolf])
      cy.visit(investments.projects.details(investmentProjectNewGolf.pk))
    })

    it('should display DA only tabs', () => {
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
