const selectors = require('../../../../selectors')

describe('DA Permission', () => {
  describe('activity', () => {
    before(() => {
      cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0')
    })

    it('should display DA only tabs', () => {
      cy.get(selectors.tabbedLocalNav().tabs)
        .should('have.length', 5)
        .and('contain', 'Company contacts')
        .and('contain', 'Core team')
        .and('contain', 'Investment')
        .and('contain', 'Export')
        .and('contain', 'Orders')
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit('')
    })

    it('should display DA only tabs', () => {
      cy.get(selectors.nav.headerNav)
        .should('have.length', 6)
        .and('contain', 'Companies')
        .and('contain', 'Contacts')
        .and('contain', 'Investments')
        .and('contain', 'Orders')
        .and('contain', 'Dashboards')
        .and('contain', 'Market Access')
    })
  })

  describe('contact details', () => {
    before(() => {
      cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/details')
    })

    it('should display DA only tabs', () => {
      cy.get(selectors.nav.sideNav)
        .should('have.length', 2)
        .and('contain', 'Details')
        .and('contain', 'Audit history')
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/details')
    })

    it('should display DA only tabs', () => {
      cy.get(selectors.nav.sideNav)
        .should('have.length', 7)
        .and('contain', 'Project details')
        .and('contain', 'Project team')
        .and('contain', 'Interactions')
        .and('contain', 'Evaluations')
        .and('contain', 'Propositions')
        .and('contain', 'Audit history')
        .and('contain', 'Evidence')
    })
  })
})
