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
    before(() => {
      cy.visit(urls.dashboard.index())
    })

    it('should display Market Access in the Datahub Bar', () => {
      cy.get('[data-test="market-access-link"]').should('be.visible')
    })

    it('should display DBT only header nav links', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Events',
        'Interactions',
        'Investments',
        'Orders',
        'Community',
        'Support',
      ])
    })
  })

  describe('activity', () => {
    const company = fixtures.company.create.corp()

    before(() => {
      cy.loadFixture([company])
      cy.visit(urls.companies.detail(company.pk))
    })

    it('should display DBT only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Overview',
        'Activity',
        'Business details',
        'Contacts',
        'Account management',
        'Investment',
        'Export',
        'Orders',
      ])
    })
    it('when on the activity tab, internal activity should be selected', () => {
      cy.get('[data-test="tabbedLocalNavList"]').contains('Activity').click()
      assertActivitytab('#field-activityType-1')
    })
  })

  describe('contact', () => {
    const company = fixtures.company.create.defaultCompany('local nav testing')
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(urls.contacts.contact(contact.pk))
    })

    it('should display DBT only side navs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
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
      cy.visit(urls.investments.projects.project(investmentProject.pk))
    })

    it('should display DBT only side navs', () => {
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
      cy.visit(urls.events.details(event.pk))
    })

    it('should display DBT only side navs', () => {
      const navSelector = '[data-test="event-details-nav-link"]'
      assertLocalNav(navSelector, ['Details', 'Attendee'])
    })
  })
})
