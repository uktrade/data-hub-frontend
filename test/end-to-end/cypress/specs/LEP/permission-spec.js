const fixtures = require('../../fixtures')
const {
  companies,
  contacts,
  events,
  interactions,
  omis,
  search,
  investments,
} = require('../../../../../src/lib/urls')

const { assertError } = require('../../support/assertions')

describe('LEP Permission', () => {
  describe('companies', () => {
    describe('orders', () => {
      before(() => {
        cy.visit(companies.orders(fixtures.company.lambdaPlc.id), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })

    describe('exports', () => {
      before(() => {
        cy.visit(companies.exports.index(fixtures.company.lambdaPlc.id), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })
  })

  describe('event', () => {
    before(() => {
      cy.visit(events.index(), { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permission to view this page")
      assertError('403')
    })
  })

  describe('interaction', () => {
    before(() => {
      cy.visit(interactions.index(), { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permission to view this page")
      assertError('403')
    })
  })

  describe('omis', () => {
    before(() => {
      cy.visit(omis.index(), { failOnStatusCode: false })
    })

    it('should prevent LEP users from accessing the page', () => {
      assertError("You don't have permission to view this page")
      assertError('403')
    })
  })

  context('search', () => {
    describe('interaction', () => {
      before(() => {
        cy.visit(search.type('interactions'), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })

    describe('event', () => {
      before(() => {
        cy.visit(search.type('events'), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })

    describe('omis', () => {
      before(() => {
        cy.visit(search.type('omis'), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })
  })

  context('investment', () => {
    describe('investment document', () => {
      investmentProjectNewZoo = fixtures.investmentProject.create.newZooLEP()

      before(() => {
        cy.loadFixture([investmentProjectNewGolf])
        cy.visit(investments.projects.documents(investmentProjectNewZoo.pk), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })

    describe('interaction', () => {
      investmentProjectNewGolf =
        fixtures.investmentProject.create.newGolfCourseDA()

      before(() => {
        cy.loadFixture([investmentProjectNewZoo])
        cy.visit(
          investments.projects.interactions.index(investmentProjectNewGolf.pk),
          { failOnStatusCode: false }
        )
      })

      it("should prevent LEP users from accessing an interaction they don't have access to", () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })

    describe('team', () => {
      investmentProjectFancyDress =
        fixtures.investmentProject.create.fancyDressManufacturing()

      before(() => {
        cy.loadFixture([investmentProjectFancyDress])
        cy.visit(investments.projects.team(investmentProjectFancyDress.pk), {
          failOnStatusCode: false,
        })
      })

      it("should prevent LEP users from accessing a team they don't have access to", () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })
  })

  context('contacts', () => {
    describe('documents', () => {
      const company = fixtures.company.create.defaultCompany('contact lep')
      const contact = fixtures.contact.create(company.pk)

      before(() => {
        cy.loadFixture([company])
        cy.loadFixture([contact])
        cy.visit(contacts.documents(contact.pk), { failOnStatusCode: false })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })

    describe('interactions', () => {
      const company = fixtures.company.create.defaultCompany('contact lep')
      const contact = fixtures.contact.create(company.pk)

      before(() => {
        cy.loadFixture([company])
        cy.loadFixture([contact])
        cy.visit(contacts.contactInteractions(contact.pk), {
          failOnStatusCode: false,
        })
      })

      it('should prevent LEP users from accessing the page', () => {
        assertError("You don't have permission to view this page")
        assertError('403')
      })
    })
  })
})
