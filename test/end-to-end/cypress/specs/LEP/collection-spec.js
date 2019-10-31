const selectors = require('../../../../selectors')
const { assertCollection } = require('../../support/assertions')

const checkCollection = () => {
  assertCollection(selectors.collection.headerCount, selectors.collection.items)
}

describe('Collection', () => {
  describe('company', () => {
    before(() => {
      cy.visit('/companies')
    })

    it('should return the results summary for a company collection', () => {
      checkCollection()
    })
  })

  describe('contact', () => {
    before(() => {
      cy.visit('/contacts')
    })

    it('should return the results summary for a contact collection', () => {
      checkCollection()
    })
  })

  context('investment', () => {
    describe('projects', () => {
      before(() => {
        cy.visit('/investments/projects')
      })

      it('should return the results summary for a contact collection', () => {
        checkCollection()
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/interactions')
      })

      it('should return the results summary for a contact collection', () => {
        checkCollection()
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/propositions')
      })

      it('should return the results summary for a contact collection', () => {
        checkCollection()
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
