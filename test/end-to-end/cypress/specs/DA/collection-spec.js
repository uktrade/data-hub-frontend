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
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/interactions')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection()
      })
    })

    describe('proposition', () => {
      before(() => {
        cy.visit('/investments/projects/ba1f0b14-5fe4-4c36-bf6a-ddf115272977/propositions')
      })

      it('should return the results summary for a contact collection', () => {
        verifyCollection()
      })
    })
  })
})
