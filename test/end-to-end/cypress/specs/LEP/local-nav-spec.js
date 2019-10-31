const selectors = require('../../../../selectors')

describe('LEP Permission', () => {
  describe('activity', () => {
    before(() => {
      cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0')
    })

    it('should display LEP only tabs', () => {
      assertNav(selectors.tabbedLocalNav().tabs, [
        'Company contacts',
        'Core team',
        'Investment',
        'Export',
      ])
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit('')
    })

    it('should display LEP only tabs', () => {
      assertNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Investments',
      ])
    })
  })

  describe('contact details', () => {
    before(() => {
      cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/details')
    })

    it('should display LEP only tabs', () => {
      assertNav(selectors.nav.sideNav, [
        'Details',
        'Audit history',
      ])
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/details')
    })

    it('should display LEP only tabs', () => {
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
