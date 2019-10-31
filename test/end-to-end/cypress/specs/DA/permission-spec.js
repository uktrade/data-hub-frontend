const { assertError } = require('../../support/assertions')

describe('DA Permission', () => {
  describe('event', () => {
    before(() => {
      cy.visit('/events', { failOnStatusCode: false })
    })

    it('should prevent DA users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  describe('interaction', () => {
    before(() => {
      cy.visit('/interactions', { failOnStatusCode: false })
    })

    it('should prevent DA users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  context('search', () => {
    describe('interaction', () => {
      before(() => {
        cy.visit('/search/interactions', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('event', () => {
      before(() => {
        cy.visit('/search/events', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  context('investment', () => {
    describe('investment document', () => {
      before(() => {
        cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/documents', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/interactions', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing an interaction they don\'t have access to', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/propositions', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing an interaction they don\'t have access to', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit('/investments/projects/b30dee70-b2d6-48cf-9ce4-b9264854470c/team', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing a team they don\'t have access to', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  context('contacts', () => {
    describe('documents', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/documents', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interactions', () => {
      before(() => {
        cy.visit('/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef/interactions', { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })
})
