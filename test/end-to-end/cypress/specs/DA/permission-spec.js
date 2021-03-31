const fixtures = require('../../fixtures')

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
      const company = fixtures.company.create.lambda('permission da')

      before(() => {
        cy.loadFixture([company])
        cy.visit(companies.exports.index(company), {
          failOnStatusCode: false,
        })
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
      investmentProjectNewGolf = fixtures.investmentProject.create.newGolfCourseDA()

      before(() => {
        cy.loadFixture([investmentProjectNewGolf])
        cy.visit(investments.projects.documents(investmentProjectNewGolf.pk), {
          failOnStatusCode: false,
        })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interaction', () => {
      investmentProjectNewZoo = fixtures.investmentProject.create.newZooLEP()

      before(() => {
        cy.loadFixture([investmentProjectNewZoo])
        cy.visit(
          investments.projects.interactions.index(investmentProjectNewZoo.pk),
          { failOnStatusCode: false }
        )
      })

      it("should prevent DA users from accessing an interaction they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('proposition', () => {
      investmentProjectNewZoo = fixtures.investmentProject.create.newZooLEP()

      before(() => {
        cy.loadFixture([investmentProjectNewZoo])
        cy.visit(
          investments.projects.propositions(investmentProjectNewZoo.pk),
          { failOnStatusCode: false }
        )
      })

      it("should prevent DA users from accessing an interaction they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('team', () => {
      investmentProjectFancyDress = fixtures.investmentProject.create.fancyDressManufacturing()

      before(() => {
        cy.loadFixture([investmentProjectFancyDress])
        cy.visit(investments.projects.team(investmentProjectFancyDress.pk), {
          failOnStatusCode: false,
        })
      })

      it("should prevent DA users from accessing a team they don't have access to", () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })

  context('contacts', () => {
    describe('documents', () => {
      const company = fixtures.company.create.defaultCompany('contact da')
      const contact = fixtures.contact.create(company.pk)

      before(() => {
        cy.loadFixture([company])
        cy.loadFixture([contact])
        cy.visit(contacts.documents(contact.pk), { failOnStatusCode: false })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })

    describe('interactions', () => {
      const company = fixtures.company.create.defaultCompany('contact da')
      const contact = fixtures.contact.create(company.pk)

      before(() => {
        cy.loadFixture([company])
        cy.loadFixture([contact])
        cy.visit(contacts.contactInteractions(contact.pk), {
          failOnStatusCode: false,
        })
      })

      it('should prevent DA users from accessing the page', () => {
        assertError('You don’t have permission to view this page')
        assertError('403')
      })
    })
  })
})
