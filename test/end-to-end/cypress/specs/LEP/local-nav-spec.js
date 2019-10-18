const selectors = require('../../../../selectors')

describe('LEP Permission', () => {
  describe('activity', () => {
    before(() => {
      cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0')
    })

    it('should display LEP only tabs', () => {
      cy.get(selectors.tabbedLocalNav().tabs)
        .should('have.length', 4)
        .and('contain', 'Company contacts')
        .and('contain', 'Core team')
        .and('contain', 'Investment')
        .and('contain', 'Export')
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit('')
    })

    it('should display LEP only tabs', () => {
      cy.get(selectors.nav.headerNav)
        .should('have.length', 3)
        .and('contain', 'Companies')
        .and('contain', 'Contacts')
        .and('contain', 'Investments')
    })
  })

  describe('contact details', () => {
    before(() => {
      cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/details')
    })

    it('should display LEP only tabs', () => {
      cy.get(selectors.nav.sideNav)
        .should('have.length', 2)
        .and('contain', 'Details')
        .and('contain', 'Audit history')
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/details')
    })

    it('should display LEP only tabs', () => {
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
