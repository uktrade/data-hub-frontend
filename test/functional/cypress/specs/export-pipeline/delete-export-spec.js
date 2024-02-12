import { exportFaker } from '../../fakers/export'

const urls = require('../../../../../src/lib/urls')
const { assertUrl } = require('../../support/assertions')

const {
  assertBreadcrumbs,
  assertFlashMessage,
} = require('../../support/assertions')

describe('Export pipeline delete', () => {
  const exportItem = exportFaker()

  context('when deleting an export for unknown export id', () => {
    beforeEach(() => {
      cy.visit('/export/a/edit')
    })

    it('should render edit event breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.exportPipeline.index(),
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when deleting an export for known export id', () => {
    const deletePageUrl = urls.exportPipeline.delete(exportItem.id)

    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      })
      cy.visit(deletePageUrl)
    })

    context('when verifying the page', () => {
      it('should render the header', () => {
        cy.get('[data-test="subheading"]').should(
          'have.text',
          `Are you sure you want to delete the export ${exportItem?.company?.name} — ‘${exportItem?.title}’?`
        )
      })

      it('should render the delete export breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.exportPipeline.index(),
          [exportItem.title]: urls.exportPipeline.details(exportItem.id),
          ['Are you sure you want to delete...']: null,
        })
      })

      it('should render a form with display a delete button', () => {
        cy.get('[data-test=submit-button]').should(
          'have.text',
          'Yes, delete this export'
        )
      })

      it('should render a form with a cancel link', () => {
        cy.get('[data-test=cancel-button]')
          .should('have.text', 'Cancel')
          .should(
            'have.attr',
            'href',
            urls.exportPipeline.details(exportItem.id)
          )
      })
    })

    context('when the form cancel button is clicked', () => {
      it('the form should return to the export tab on the dashboard page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.exportPipeline.details(exportItem.id))
      })
    })

    context('when the delete form is submitted', () => {
      beforeEach(() => {
        cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
          body: exportItem,
        })
        cy.intercept('DELETE', `/api-proxy/v4/export/${exportItem.id}`, {}).as(
          'deleteExportItemApiRequest'
        )
        cy.visit(deletePageUrl)
      })

      it('the form should return to the export tab on the dashboard page', () => {
        cy.get('[data-test=submit-button]').click()

        cy.wait('@deleteExportItemApiRequest').then(({ request }) => {
          expect(request.url).to.contain(exportItem.id)
        })

        assertUrl(urls.exportPipeline.index())

        assertFlashMessage(`‘${exportItem.title}’ has been deleted`)
      })
    })
  })
})
