const {
  companies,
  contacts,
  events,
  interactions,
  search,
  investments,
} = require('../../../../../src/lib/urls')

const { assertError } = require('../../support/assertions')

describe('DA Permission', () => {
  describe('companies', () => {
    describe('exports', () => {
      before(() => {
        cy.visit(
          companies.exports.index('0fb3379c-341c-4da4-b825-bf8d47b26baa'),
          {
            failOnStatusCode: false,
          }
        )
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  describe('event', () => {
    before(() => {
      cy.visit(events.index(), { failOnStatusCode: false })
    })

    it('should prevent DA users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  describe('interaction', () => {
    before(() => {
      cy.visit(interactions.index(), { failOnStatusCode: false })
    })

    it('should prevent DA users from accessing the page', () => {
      assertError('You don’t have permission to view this page')
      assertError('403')
    })
  })

  context('search', () => {
    describe('interaction', () => {
      before(() => {
        cy.visit(search.type('interactions'), { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('event', () => {
      before(() => {
        cy.visit(search.type('events'), { failOnStatusCode: false })
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
        cy.visit(
          investments.projects.documents(
            'e32b3c33-80ac-4589-a8c4-dda305d726ba'
          ),
          { failOnStatusCode: false }
        )
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit(
          investments.projects.interactionCollection(
            'ba1f0b14-5fe4-4c36-bf6a-ddf115272977'
          ),
          { failOnStatusCode: false }
        )
      })

      it("should prevent DA users from accessing an interaction they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit(
          investments.projects.propositions(
            'ba1f0b14-5fe4-4c36-bf6a-ddf115272977'
          ),
          { failOnStatusCode: false }
        )
      })

      it("should prevent DA users from accessing an interaction they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit(
          investments.projects.team('b30dee70-b2d6-48cf-9ce4-b9264854470c'),
          { failOnStatusCode: false }
        )
      })

      it("should prevent DA users from accessing a team they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  context('contacts', () => {
    describe('documents', () => {
      before(() => {
        cy.visit(contacts.documents('9b1138ab-ec7b-497f-b8c3-27fed21694ef'), {
          failOnStatusCode: false,
        })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interactions', () => {
      before(() => {
        cy.visit(
          contacts.contactInteractions('9b1138ab-ec7b-497f-b8c3-27fed21694ef'),
          { failOnStatusCode: false }
        )
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })
})
