const selectors = require('../../../../selectors')
const { assertLocalNav } = require('../../support/assertions')

describe('DIT Permission', () => {
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
