const urls = require('../../../../src/lib/urls')

describe('investment project', () => {
  before(() => {
    cy.visit(urls.investments.index())
  })

  it('should render investment project page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('investmentPage')
  })
})

describe('investment profile', () => {
  before(() => {
    cy.visit(urls.investments.profiles.index())
  })

  it('should render investment profile page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('investmentProfilePage')
  })
})

describe('investment opportunity', () => {
  before(() => {
    cy.visit(urls.investments.opportunities.index())
  })

  it('should render investment opportunity page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('investmentOpportunityPage')
  })
})
