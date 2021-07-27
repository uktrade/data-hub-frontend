const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const {
  companies,
  // contacts,
  investments,
} = require('../../../../../src/lib/urls')

const { assertCollection } = require('../../support/assertions')

const checkCollection = () => {
  assertCollection(selectors.collection.headerCount, selectors.collection.items)
}

describe('Collection', () => {
  describe('company', () => {
    before(() => {
      cy.visit(companies.index())
    })

    it('should return the results summary for a company collection', () => {
      checkCollection()
    })
  })

  describe('contact', () => {
    before(() => {
      cy.visit(contacts.index())
    })

    it('should return the results summary for a contact collection', () => {
      // result could be 7 or more given we add contacts on permission spec
      cy.get('[data-test="collectionCount"]').should('be.gte', '7')
    })
  })

  context('investment', () => {
    describe('projects', () => {
      before(() => {
        cy.visit(investments.projects.index())
      })

      it('should return the results summary for a investment collection', () => {
        cy.get('[data-test="collectionCount"]').should('have.text', '1')
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit(
          investments.projects.interactions.index(
            fixtures.investmentProject.newGolfCourse.id
          )
        )
      })

      it('should return the results summary for a interaction collection', () => {
        checkCollection()
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit(
          investments.projects.propositions(
            fixtures.investmentProject.newGolfCourse.id
          )
        )
      })

      it('should return the results summary for a proposition collection', () => {
        checkCollection()
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit(
          investments.projects.team(fixtures.investmentProject.newGolfCourse.id)
        )
      })

      it('should return the investment project team summary', () => {
        cy.get(selectors.companyInvestmentProjects.investmentTeamGrid)
          .should('contain', 'Client Relationship Manager')
          .and('contain', 'Marketing - Marketing Team')
          .and('contain', 'Paula Churing')
      })
    })
  })
})
