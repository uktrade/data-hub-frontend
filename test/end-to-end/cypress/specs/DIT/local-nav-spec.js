const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const {
  assertLocalNav,
  assertLocalReactNav,
} = require('../../support/assertions')

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
        'Market access',
        'Support',
      ])
    })
  })

  describe('activity', () => {
    const company = fixtures.company.create.corp()

    before(() => {
      cy.loadFixture([company])
      cy.visit(companies.detail(company.pk))
    })

    it('should display DIT only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Activity',
        'Business details',
        'Company contacts',
        'Core team',
        'Investment',
        'Export',
        'Orders',
      ])
    })
  })

  describe('contact', () => {
    const company = fixtures.company.create.defaultCompany('local nav testing')
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(contacts.contact(contact.pk))
    })

    it('should display DIT only side navs', () => {
      assertLocalReactNav('[data-test=local-nav]', [
        'Details',
        'Activity',
        'Audit history',
        'Documents',
      ])
    })
  })

  describe('investment', () => {
    before(() => {
      const investmentProject = fixtures.investmentProject.create.newHotelFdi()
      cy.loadFixture([investmentProject])
      cy.visit(investments.projects.project(investmentProject.pk))
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
      const event = fixtures.event.create.defaultEvent()
      cy.loadFixture([event])
      cy.visit(events.details(event.pk))
    })

    it('should display DIT only side navs', () => {
      const navSelector = '[data-test="eventDetails"] > div > nav > a'
      assertLocalNav(navSelector, ['Details', 'Attendee'])
    })
  })
})
