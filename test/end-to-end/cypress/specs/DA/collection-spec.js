const fixtures = require('../../fixtures')

const {
  companies,
  contacts,
  investments,
} = require('../../../../../src/lib/urls')

const { assertCollection } = require('../../support/assertions')

const assertTable = ({ element, rows }) => {
  cy.get(element).as('table')

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

describe('Collection', () => {
  describe('company', () => {
    before(() => {
      cy.visit(companies.index(), { qs: { name: 'Motor' } })
    })

    it('should return the results summary for a company collection', () => {
      cy.get('[data-test="collectionCount"]').should('have.text', '2')
    })
  })

  describe('contact', () => {
    before(() => {
      cy.visit(contacts.index())
    })

    it('should return the results summary for a contact collection', () => {
      // result could be 7 or more given we add contacts on permission spec
      cy.get('[data-test="collectionCount"]')
        .invoke('text')
        .then((count) => {
          expect(parseInt(count)).to.be.gte(7)
        })
    })
  })

  context('investment', () => {
    describe('projects', () => {
      before(() => {
        cy.visit(investments.projects.index())
      })

      it('should return the results summary for a investment collection', () => {
        assertCollection('collectionCount', false)
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
        assertCollection('collection-count', false)
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
        assertCollection('collection-count')
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit(
          investments.projects.team(fixtures.investmentProject.newGolfCourse.id)
        )
      })

      it('should return the investment project team summary', () => {
        assertTable({
          element: '[data-test="crm-table"]',
          rows: [
            ['Role', 'Adviser', 'Team'],
            [
              'Client Relationship Manager',
              'Paula Churing',
              'Marketing - Marketing Team',
            ],
          ],
        })
      })
    })
  })
})
