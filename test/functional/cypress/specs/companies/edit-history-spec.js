const { assertLocalHeader, assertBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Edit History', () => {
  context('when viewing the "Edit History" page', () => {
    before(() => {
      cy.visit(urls.companies.editHistory(fixtures.company.venusLtd.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Edit History')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': urls.dashboard(),
        'Companies': urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Business details': urls.companies.businessDetails(fixtures.company.venusLtd.id),
        'Edit History': null,
      })
    })
  })
})
