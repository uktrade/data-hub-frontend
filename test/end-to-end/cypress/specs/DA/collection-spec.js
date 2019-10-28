const selectors = require('../../../../selectors')

const verifyCollection = () => {
  cy.get(selectors.collection.headerCount).invoke('text').then((headerCount) => {
    cy.get(selectors.collection.items).should((collectionItems) => {
      expect(headerCount).to.eq(collectionItems.length.toString())
    })
  })
}

describe('Collection', () => {
  describe('company', () => {
    before(() => {
      cy.visit('/companies')
    })

    it('should return the results summary for a company collection', () => {
      verifyCollection()
    })
  })

  describe('contact', () => {
    before(() => {
      cy.visit('/contacts')
    })

    it('should return the results summary for a contact collection', () => {
      verifyCollection()
    })
  })

  context('investment', () => {
    describe('projects', () => {
      before(() => {
        cy.visit('/investments/projects')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection()
      })
    })

    describe('interaction', () => {
      before(() => {
        cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/interactions')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection()
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/propositions')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection()
      })
    })

    describe('team', () => {
      before(() => {
        cy.visit('/investments/projects/e32b3c33-80ac-4589-a8c4-dda305d726ba/team')
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
