const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Match a company', () => {
  context('when viewing "Find this company record" page', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Find this company record')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Find this company record': null,
      })
    })
  })
})
