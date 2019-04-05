const fixtures = require('~/test/functional/cypress/fixtures')
const selectors = require('~/test/functional/cypress/selectors')

describe('Companies matching select', () => {
  context('when viewing the matching select form', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/matching/select`)
    })

    it('should display the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', `Select the match for ${fixtures.company.oneListCorp.name}`)
    })
  })
})
