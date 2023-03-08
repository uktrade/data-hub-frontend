const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Export pipeline create', () => {
  context('when adding an export for unknown company id', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/v4/company/not_real', {
        statusCode: 404,
      }).as('getServerFailure')
      cy.visit('/export/create?companyId=not_real')
    })

    it('should render the header', () => {
      assertLocalHeader('Add export')
      cy.get('[data-test="subheading"]').should('not.exist')
    })

    it('should render add event breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Add export': null,
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="company-load-error"]').should('be.visible')
    })
  })

  context('when adding an export for known company id', () => {
    const company = fixtures.company.venusLtd

    beforeEach(() => {
      cy.visit(`/export/create?companyId=${company.id}`)
    })

    it('should render the header', () => {
      assertLocalHeader('Add export')
      cy.get('[data-test="subheading"]').should('have.text', company.name)
    })

    it('should render the add event breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [company.name]: urls.companies.detail(company.id),
        'Add export': null,
      })
    })

    it('the form should display a save button', () => {
      cy.get('[data-test=submit-button]').should('have.text', 'Save')
    })

    it('the form should display a cancel link', () => {
      cy.get('[data-test=cancel-button]')
        .should('have.text', 'Cancel')
        .should('have.attr', 'href', urls.companies.detail(company.id))
    })

    it('the form should redirect to the company page when the cancel button is clicked', () => {
      cy.get('[data-test=cancel-button]').click()
      assertUrl(urls.companies.detail(company.id))
    })
  })
})
