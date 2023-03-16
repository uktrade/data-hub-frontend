const urls = require('../../../../../src/lib/urls')
const { assertUrl } = require('../../support/assertions')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')

describe('Export pipeline edit', () => {
  const exportItem = exportItems.results[0]
  context('when adding an export for known company id', () => {
    before(() => {})

    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('apiRequest')
      cy.visit(urls.exportPipeline.edit(exportItem.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Edit export')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        exportItem.company.name
      )
    })

    it('should render the edit export breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [exportItem.company.name]: urls.companies.activity.index(
          exportItem.company.id
        ),
        [exportItem.title]: null,
      })
    })

    it('the form should display a save button', () => {
      cy.get('[data-test=submit-button]').should('have.text', 'Save')
    })

    it('the form should display a cancel link', () => {
      cy.get('[data-test=cancel-button]')
        .should('have.text', 'Cancel')
        .should(
          'have.attr',
          'href',
          urls.companies.activity.index(exportItem.company.id)
        )
    })

    it('the form should redirect to the company page when the cancel button is clicked', () => {
      cy.get('[data-test=cancel-button]').click()
      assertUrl(urls.companies.activity.index(exportItem.company.id))
    })
  })
})
