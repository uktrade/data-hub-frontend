const { assertLocalHeader, assertBreadcrumbs } = require('../../support/assertions')
const { assertLocalNav } = require('../../../../end-to-end/cypress/support/assertions')

const selectors = require('../../../../selectors')
const { company: { dnbGlobalUltimate, dnBGlobalUltimateAndGlobalHq } } = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('D&B Company hierarchy', () => {
  context('when viewing hierarchy for a D&B Global Ultimate', () => {
    before(() => {
      cy.visit(urls.companies.dnbHierarchy.index(dnbGlobalUltimate.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Company records related to DnB Global Ultimate')
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

    it('should render related company records counter', () => {
      cy.get('#dnb-hierarchy')
        .should('contain', '2 related company records')
        .and('contain', 'DnB Global Ultimate')
        .and('contain', 'DnB Global Ultimate subsidiary')
    })

    it('should now show explanation why the D&B hierarchy might have fewer records than manual one', () => {
      cy.contains("Why aren't all manually linked subsidiaries listed here?")
        .should('not.be.visible')
    })
  })

  context('when viewing hierarchy for a D&B Global Ultimate which is also Global HQ', () => {
    before(() => {
      cy.visit(urls.companies.dnbHierarchy.index(dnBGlobalUltimateAndGlobalHq.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Company records related to DnB Global Ultimate')
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

    it('should render related company records counter', () => {
      cy.get('#dnb-hierarchy')
        .should('contain', '2 related company records')
        .and('contain', 'DnB Global Ultimate')
        .and('contain', 'DnB Global Ultimate subsidiary')
    })

    it('should display the local nav', () => {
      assertLocalNav(selectors.tabbedLocalNav().tabs, [
        'Dun & Bradstreet hierarchy',
        'Manually linked subsidiaries',
      ])
    })

    it('should show explanation why the D&B hierarchy might have fewer records than manual one', () => {
      cy.get('details:contains("Why aren\'t all manually linked subsidiaries listed here?")')
        .should('have.text', '' +
        'Why aren\'t all manually linked subsidiaries listed here?This does not' +
        ' mean that Dun & Bradstreet does not know about those subsidiaries.The' +
        ' Dun & Bradstreet hierarchy information can only show the company records' +
        ' in Data Hub that have been matched to a verified Dun & Bradstreet record.' +
        ' This matching process is ongoing and more related company records will' +
        ' appear in the future.')
    })
  })
})
