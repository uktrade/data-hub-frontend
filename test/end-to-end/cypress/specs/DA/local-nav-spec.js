const selectors = require('../../../../selectors')
const { assertNav } = require('../../support/assertions')

describe('DA Permission', () => {
  describe('activity', () => {
    before(() => {
      cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0')
    })

    it('should display DA only tabs', () => {
      assertNav(selectors.tabbedLocalNav().tabs, [
        'Company contacts',
        'Core team',
        'Investment',
        'Export',
        'Orders',
      ])
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit('')
    })

    it('should display DA only tabs', () => {
      assertNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Investments',
        'Orders',
        'Dashboards',
        'Market Access',
      ])
    })
  })

  describe('contact details', () => {
    before(() => {
      cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/details')
    })

    it('should display DA only tabs', () => {
      assertNav(selectors.nav.sideNav, [
        'Details',
        'Audit history',
      ])
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/details')
    })

    it('should display DA only tabs', () => {
      assertNav(selectors.nav.sideNav, [
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
})
