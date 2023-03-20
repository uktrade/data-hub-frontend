const urls = require('../../../../../src/lib/urls')
const { assertUrl } = require('../../support/assertions')

const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertFlashMessage,
  assertFieldTypeahead,
  assertFieldInput,
} = require('../../support/assertions')
const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')
const {
  ERROR_MESSAGES,
} = require('../../../../../src/client/modules/ExportPipeline/ExportForm/constants')

describe('Export pipeline edit', () => {
  const exportItem = exportItems.results[0]

  context('when editing an export for unknown company id', () => {
    beforeEach(() => {
      cy.visit('/export/a/edit')
    })

    it('should render the header', () => {
      assertLocalHeader('Edit export')
      cy.get('[data-test="subheading"]').should('not.exist')
    })

    it('should render edit event breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when editing an export for known company id', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.intercept('PATCH', `/api-proxy/v4/export/${exportItem.id}`).as(
        'patchExportItemApiRequest'
      )
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
        .should('have.attr', 'href', urls.dashboard())
    })

    it('the form should redirect to the dashboard page when the cancel button is clicked', () => {
      cy.get('[data-test=cancel-button]').click()
      assertUrl(urls.dashboard())
    })

    it('the form should display with the saved values in the form fields', () => {
      cy.get('[data-test="field-title"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Export title',
          ignoreHint: true,
          value: exportItem.title,
        })
      })
      cy.get('[data-test="field-owner"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Owner',
          value: exportItem.owner.name,
          isMulti: false,
        })
      })
    })

    context('when the form contains invalid data and is submitted', () => {
      it('the form should display validation error message for mandatory inputs', () => {
        //clear any default values first
        cy.get('[data-test="title-input"]').clear()
        cy.get('[data-test="typeahead-input"]').clear()

        cy.get('[data-test=submit-button]').click()

        //TODO use asserts instead of manual shoulds
        cy.get('[data-test="field-title"] > fieldset > div > span').should(
          'contain.text',
          ERROR_MESSAGES.title
        )
        cy.get('[data-test="field-owner"] > fieldset > div > span').should(
          'contain.text',
          ERROR_MESSAGES.owner
        )
      })
    })

    context('when the form contains valid data and is submitted', () => {
      it('the form should stay on the current page', () => {
        cy.get('[data-test=submit-button]').click()

        //While building the form do individual checks, can switch to assertPayload once all fields are added
        cy.wait('@patchExportItemApiRequest').then(({ request }) => {
          expect(request.body).to.have.property('title', exportItem.title)
          expect(request.body.owner).to.have.property('id', exportItem.owner.id)
        })

        assertUrl(urls.exportPipeline.edit(exportItem.id))

        assertFlashMessage(`Changes saved to '${exportItem.title}'`)
      })
    })
  })
})
