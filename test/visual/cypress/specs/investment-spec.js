const urls = require('../../../../src/lib/urls')

describe('investment project', () => {
  before(() => {
    cy.viewport(1980, 1440)
    cy.intercept('POST', '/api-proxy/v3/search/investment_project').as(
      'apiRequest'
    )
    cy.visit(urls.investments.index())
    cy.wait('@apiRequest')
  })

  it('should render investment project page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('investmentPage')
  })
})

describe('investment profile', () => {
  before(() => {
    cy.viewport(1980, 1440)
    cy.intercept('POST', '/api-proxy/v4/search/large-investor-profile').as(
      'apiRequest'
    )
    cy.visit(urls.investments.profiles.index())
    cy.wait('@apiRequest')
  })

  it('should render investment profile page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('investmentProfilePage')
  })
})

describe('investment opportunity', () => {
  before(() => {
    cy.viewport(1980, 1440)
    cy.intercept('POST', '/api-proxy/v4/search/large-capital-opportunity').as(
      'apiRequest'
    )
    cy.visit(urls.investments.opportunities.index())
    cy.wait('@apiRequest')
  })

  it('should render investment opportunity page correctly', () => {
    cy.get('[data-test="collection-item"]').should('be.visible')
    cy.compareSnapshot('investmentOpportunityPage')
  })
})
