const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertUrl,
  assertExactUrl,
  assertFlashMessage,
  assertPayload,
} = require('../../support/assertions')
const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

const {
  ERROR_MESSAGES,
} = require('../../../../../src/client/modules/ExportPipeline/ExportForm/constants')
const {
  generateExport,
} = require('../../../../sandbox/routes/v4/export/exports')

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
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when adding an export for known company id', () => {
    const company = fixtures.company.venusLtd

    beforeEach(() => {
      cy.intercept('POST', `/api-proxy/v4/export`).as(
        'postExportItemApiRequest'
      )
      cy.visit(`/export/create?companyId=${company.id}`)
    })

    it('should render the header', () => {
      assertLocalHeader('Add export')
      cy.get('[data-test="subheading"]').should('have.text', company.name)
    })

    it('should render the add export breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [company.name]: urls.companies.activity.index(company.id),
        'Add export': null,
      })
    })

    it('the form should display a save button', () => {
      cy.get('[data-test=submit-button]').should('have.text', 'Save')
    })

    it('the form should display a cancel link', () => {
      cy.get('[data-test=cancel-button]')
        .should('have.text', 'Cancel')
        .should('have.attr', 'href', urls.companies.activity.index(company.id))
    })

    it('the form should redirect to the company page when the cancel button is clicked', () => {
      cy.get('[data-test=cancel-button]').click()
      assertUrl(urls.companies.activity.index(company.id))
    })

    context('when the form contains invalid data and is submitted', () => {
      it('the form should display validation error message for mandatory inputs', () => {
        cy.get('[data-test=submit-button]').click()
        cy.get('[data-test="field-title"] > fieldset > div > span').should(
          'contain.text',
          ERROR_MESSAGES.title
        )
      })
    })

    context(
      'when the form contains valid data and the form is submitted',
      () => {
        it('the form should redirect to the dashboard page and display a success message', () => {
          const newExport = generateExport()

          cy.get('[data-test="title-input"]').type(newExport.title)
          cy.get('[data-test=submit-button]').click()

          assertPayload('@postExportItemApiRequest', { title: newExport.title })

          assertExactUrl('')
          assertFlashMessage(`'${newExport.title}' created`)
        })
      }
    )
  })
})
