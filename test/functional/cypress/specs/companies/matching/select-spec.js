const fixtures = require('test/functional/cypress/fixtures')
const selectors = require('test/functional/cypress/selectors')

describe('Companies matching select', () => {
  context('when viewing the matching select form', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/matching/select`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', fixtures.company.oneListCorp.name)
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/companies/${fixtures.company.oneListCorp.id}`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Select the match')
    })

    it('should display the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', `Select the match for ${fixtures.company.oneListCorp.name}`)
    })
  })
})
