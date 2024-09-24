const { company } = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Export wins moved banner', () => {
  it('There should be a banner informing about export wins moving to Data Hub on the company page', () => {
    cy.visit(urls.companies.exports.index(company.dnbCorp.id))

    cy.get('[data-test="status-message"')
      .should(
        'have.text',
        'Historic export wins have now moved to Data Hub, see the export wins announcement.'
      )
      .within(() => {
        cy.contains('a', 'see the export wins announcement').should(
          'have.attr',
          'href',
          'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/export-wins-has-moved-to-data-hub/'
        )
      })
  })

  describe("There should't be a banner in the other tabs", () => {
    ;[
      'overview',
      'activity',
      'business-details',
      'contacts',
      'account-management',
      'investments/projects',
      'orders',
    ].forEach((slug) =>
      it(slug, () => {
        cy.visit(`/companies/${company.dnbCorp.id}/${slug}`)

        // We need to wait for company name appear...
        cy.contains(company.dnbCorp.name)

        // ...so that this waits for whent the data has been loaded and rendered
        cy.contains('Historic export wins have now moved to Data Hub').should(
          'not.exist'
        )
      })
    )
  })
})
