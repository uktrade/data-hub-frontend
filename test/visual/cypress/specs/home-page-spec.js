describe('home page', () => {
  before(() => {
    cy.intercept('GET', '/api-proxy/v4/company-list').as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
  })

  it('content', () => {
    cy.get('.dashboard-section__info-feed-date').hideElement()
    cy.get('[for="company-name"]').should('be.visible')
    cy.get('#main-content').compareSnapshot('homePageContent')
  })

  it('header', () => {
    cy.get('.datahub-header').compareSnapshot('homePageHeader')
  })

  it('search bar', () => {
    cy.get('.govuk-grid-column-full')
      .first()
      .compareSnapshot('homePageSearchBar')
  })
})
