const { assertLocalHeader, assertBreadcrumbs } = require('../../support/assertions')

const { company: { dnbGlobalUltimate } } = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('D&B Company subsidiaries', () => {
  context('when viewing subsidiaries for a Dun & Bradstreet company', () => {
    before(() => {
      cy.visit(urls.companies.dnbSubsidiaries.index(dnbGlobalUltimate.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Subsidiaries of DnB Global Ultimate')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': urls.dashboard(),
        'Companies': urls.companies.index(),
        [dnbGlobalUltimate.name]: urls.companies.detail(dnbGlobalUltimate.id),
        'Business details': urls.companies.businessDetails(dnbGlobalUltimate.id),
        'Subsidiaries': null,
      })
    })

    it('should render subsidiaries', () => {
      cy.get('#dnb-subsidiaries')
        .should('contain', '1 subsidiary')
        .and('contain', 'DnB Global Ultimate subsidiary')
    })

    it('should not include Global Ultimate', () => {
      cy.get('#dnb-subsidiaries')
        .should('not.contain', '1700 Amphitheatre Way')
    })
  })
})
