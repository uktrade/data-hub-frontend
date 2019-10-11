const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const { assertBreadcrumbs } = require('../../../support/assertions')

describe('Companies matching select', () => {
  context('when viewing the matching select form', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/matching/select`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.oneListCorp.name]: `/companies/${fixtures.company.oneListCorp.id}`,
        'Select the match': null,
      })
    })

    it('should display the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', `Select the match for ${fixtures.company.oneListCorp.name}`)
    })
  })
})
