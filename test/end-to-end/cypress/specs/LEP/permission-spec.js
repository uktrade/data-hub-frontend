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

  describe('orders', () => {
    before(() => {
      cy.visit('/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa/orders', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      cy.get(selectors.collection.error).should('contain', '403')
    })
  })

  describe('event', () => {
    before(() => {
      cy.visit('/events', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      cy.get(selectors.collection.error).should('contain', '403')
    })
  })

  describe('interaction', () => {
    before(() => {
      cy.visit('/interactions', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      cy.get(selectors.collection.error).should('contain', '403')
    })
  })

  describe('investment document', () => {
    before(() => {
      cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/documents', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      cy.get(selectors.collection.error).should('contain', '403')
    })
  })

  context('contacts', () => {
    describe('details', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/details', { failOnStatusCode: false })
      })

      it('should display LEP only tabs', () => {
        cy.get(selectors.nav.sideNav)
          .should('have.length', 2)
          .and('contain', 'Details')
          .and('contain', 'Audit history')
      })
    })

    describe('documents', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/documents', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        cy.get(selectors.collection.error).should('contain', '403')
      })
    })

    describe('interactions', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/interactions', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        cy.get(selectors.collection.error).should('contain', '403')
      })
    })
  })
})
