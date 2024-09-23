const { company } = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Export wins moved banner', () => {
  it('There should be a banner informing about export wins moving to Data Hub on the company page', () => {
    cy.visit(urls.companies.detail(company.dnbCorp.id))

    cy.get('[data-test="status-message"')
      .should(
        'have.text',
        'Historic export wins have now moved to Data Hub, find out more.'
      )
      .within(() => {
        cy.contains('a', 'find out more').should(
          'have.attr',
          'href',
          'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/export-wins-has-moved-to-data-hub/'
        )
      })
  })
})
