const {
  assertTabbedLocalNav,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

describe('EYB leads', () => {
  context('When visiting the EYB leads tab', () => {
    beforeEach(() => {
      cy.visit(investments.eybLeads.index())
    })

    it('should render the header', () => {
      assertLocalHeader('EYB leads')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        'EYB leads': null,
      })
    })

    it('should render the local navigation', () => {
      assertTabbedLocalNav('Projects')
      assertTabbedLocalNav('EYB leads')
      assertTabbedLocalNav('Investor profiles')
      assertTabbedLocalNav('UK opportunities')
    })
  })
})
