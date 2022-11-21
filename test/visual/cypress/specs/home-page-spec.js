describe('home page', () => {
  before(() => {
    cy.intercept('GET', '/api-proxy/v4/company-list').as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
  })

  it('content', () => {
    cy.viewport(1024, 768)
    cy.get('.dashboard-section__info-feed-date').hideElement()
    cy.get('[for="company-name"]').should('be.visible')
    cy.get('#main-content').compareSnapshot('homePageContent')
  })

  it('header', () => {
    cy.viewport('ipad-mini')
    cy.get('#datahub-header').compareSnapshot('homePageHeader')
  })

  it('search bar', () => {
    cy.viewport('ipad-mini')
    cy.get('#dashboard-local-header')
      .first()
      .compareSnapshot('homePageSearchBar')
  })
})
