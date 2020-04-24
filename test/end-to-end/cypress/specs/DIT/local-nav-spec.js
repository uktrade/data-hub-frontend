const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { assertLocalNav } = require('../../support/assertions')

const {
  companies,
  contacts,
  dashboard,
  events,
  investments,
} = require('../../../../../src/lib/urls')

describe('DIT Permission', () => {
  describe('dashboard', () => {
    before(() => {
      cy.visit(dashboard())
    })

    it('should display DIT only header nav links', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Events',
        'Interactions',
        'Investments',
        'Orders',
        'Dashboards',
        'Market Access',
      ])
    })
  })

  describe('activity', () => {
    before(() => {
      cy.visit(companies.detail(fixtures.company.oneListCorp.id))
    })

    it('should display DIT only tabs', () => {
      assertLocalNav(selectors.tabbedLocalNav().tabs, [
        'Activity',
        'Company contacts',
        'Core team',
        'Investment',
        'Export',
        'Orders',
      ])
    })
  })

  describe('contact', () => {
    before(() => {
      cy.visit(contacts.contact(fixtures.contact.johnnyCakeman.id))
    })

    it('should display DIT only side navs', () => {
      assertLocalNav(selectors.nav.sideNav, [
        'Details',
        'Interactions',
        'Audit history',
        'Documents',
      ])
    })
  })

  describe('investment', () => {
    before(() => {
      cy.visit(
        investments.projects.project(
          fixtures.investmentProject.newHotelCommitmentToInvest.id
        )
      )
    })

    it('should display DIT only side navs', () => {
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

  describe('event', () => {
    before(() => {
      cy.visit(events.details(fixtures.company.teddyBearExpo.id))
    })

    it('should display DIT only side navs', () => {
      assertLocalNav(selectors.nav.sideNav, ['Details', 'Attendee'])
    })
  })
})
