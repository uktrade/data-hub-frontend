const selectors = require('../../../../selectors')
const { assertLocalNav } = require('../../support/assertions')

const { investments } = require('../../../../../src/lib/urls')

describe('DIT Permission', () => {
  describe('dashboard', () => {
    before(() => {
      cy.visit('')
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
      cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0')
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
      cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef')
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
      cy.visit(investments.projects.project('fb5b5006-56af-40e0-8615-7aba53e0e4bf'))
    })

    it('should display DIT only side navs', () => {
      assertLocalNav(selectors.nav.sideNav, [
        'Project details',
        'Project team',
        'Interactions',
        'Evaluations',
        'Propositions',
        'Audit history',
        'Evidence',
      ])
    })
  })

  describe('event', () => {
    before(() => {
      cy.visit('/events/b93d4274-36fe-4008-ac40-fbc197910791/details')
    })

    it('should display DIT only side navs', () => {
      assertLocalNav(selectors.nav.sideNav, [
        'Details',
        'Attendee',
      ])
    })
  })
})
