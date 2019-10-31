const selectors = require('../../../../selectors')
const { verifyCollection } = require('../../support/assertions')

const headerCount = selectors.collection.headerCount
const collectionItems = selectors.collection.items

describe('Collection', () => {
  describe('company', () => {
    before(() => {
      cy.visit('/companies')
    })

    it('should return the results summary for a company collection', () => {
      verifyCollection(headerCount, collectionItems)
    })
  })

  describe('contact', () => {
    before(() => {
      cy.visit('/contacts')
    })

    it('should return the results summary for a contact collection', () => {
      verifyCollection(headerCount, collectionItems)
    })
  })

  context('investment', () => {
    describe('projects', () => {
      before(() => {
        cy.visit('/investments/projects')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection(headerCount, collectionItems)
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/interactions')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection(headerCount, collectionItems)
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/propositions')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection(headerCount, collectionItems)
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/team')
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
