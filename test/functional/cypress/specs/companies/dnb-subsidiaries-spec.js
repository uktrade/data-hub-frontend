const { assertLocalHeader, assertBreadcrumbs } = require('../../support/assertions')
const { assertLocalNav } = require('../../../../end-to-end/cypress/support/assertions')

const selectors = require('../../../../selectors')
const { company: { dnbGlobalUltimate, dnBGlobalUltimateAndGlobalHq } } = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('D&B Company subsidiaries', () => {
  context('when viewing subsidiaries for a D&B Global Ultimate', () => {
    before(() => {
      cy.visit(urls.companies.dnbSubsidiaries.index(dnbGlobalUltimate.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Companies related to DnB Global Ultimate')
    })

    it('should render the helper text', () => {
      cy.get('p').should('contain', 'This hierarchy information from Dun & Bradstreet cannot be edited.')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': urls.dashboard(),
        'Companies': urls.companies.index(),
        [dnbGlobalUltimate.name]: urls.companies.detail(dnbGlobalUltimate.id),
        'Business details': urls.companies.businessDetails(dnbGlobalUltimate.id),
        'Related companies': null,
      })
    })

    it('should render related companies', () => {
      cy.get('#dnb-subsidiaries')
        .should('contain', '2 related companies')
        .and('contain', 'DnB Global Ultimate')
        .and('contain', 'DnB Global Ultimate subsidiary')
    })
  })

  context('when viewing subsidiaries for a D&B Global Ultimate which is also Global HQ', () => {
    before(() => {
      cy.visit(urls.companies.dnbSubsidiaries.index(dnBGlobalUltimateAndGlobalHq.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Companies related to DnB Global Ultimate')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': urls.dashboard(),
        'Companies': urls.companies.index(),
        [dnBGlobalUltimateAndGlobalHq.name]: urls.companies.detail(dnBGlobalUltimateAndGlobalHq.id),
        'Business details': urls.companies.businessDetails(dnBGlobalUltimateAndGlobalHq.id),
        'Related companies': null,
      })
    })

    it('should render related companies', () => {
      cy.get('#dnb-subsidiaries')
        .should('contain', '2 related companies')
        .and('contain', 'DnB Global Ultimate')
        .and('contain', 'DnB Global Ultimate subsidiary')
    })

    it('should display the local nav', () => {
      assertLocalNav(selectors.tabbedLocalNav().tabs, [
        'Dun & Bradstreet hierarchy',
        'Manually linked subsidiaries',
      ])
    })
  })
})
