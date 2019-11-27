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
})
