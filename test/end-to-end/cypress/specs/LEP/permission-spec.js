const { assertError } = require('../../support/assertions')

describe('LEP Permission', () => {
  describe('orders', () => {
    before(() => {
      cy.visit('/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa/orders', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permissions to this page")
      assertError('403')
    })
  })

  describe('event', () => {
    before(() => {
      cy.visit('/events', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permissions to this page")
      assertError('403')
    })
  })

  describe('interaction', () => {
    before(() => {
      cy.visit('/interactions', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permissions to this page")
      assertError('403')
    })
  })

  describe('omis', () => {
    before(() => {
      cy.visit('/omis', { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permissions to this page")
      assertError('403')
    })
  })

  context('search', () => {
    describe('interaction', () => {
      before(() => {
        cy.visit('/search/interactions', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })

    describe('event', () => {
      before(() => {
        cy.visit('/search/events', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })

    describe('omis', () => {
      before(() => {
        cy.visit('/search/omis', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })
  })

  context('investment', () => {
    describe('investment document', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/documents', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/interactions', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing an interaction they don\'t have access to', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit('/investments/projects/b30dee70-b2d6-48cf-9ce4-b9264854470c/team', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing a team they don\'t have access to', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })
  })

  context('contacts', () => {
    describe('documents', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/documents', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })

    describe('interactions', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/interactions', { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permissions to this page")
        assertError('403')
      })
    })
  })
})
