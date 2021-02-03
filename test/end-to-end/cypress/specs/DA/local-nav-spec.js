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
    before(() => {
      cy.visit(companies.detail(fixtures.company.oneListCorp.id))
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
    before(() => {
      cy.visit(contacts.details(fixtures.contact.johnnyCakeman.id))
    })

    it('should display DA only tabs', () => {
      assertLocalNav(selectors.nav.sideNav, ['Details', 'Audit history'])
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit(
        investments.projects.details(
          fixtures.investmentProject.newGolfCourse.id
        )
      )
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
