const urls = require('../../../../../src/lib/urls')
const { assertUrl } = require('../../support/assertions')

const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertFlashMessage,
  assertFieldTypeahead,
  assertFieldError,
  assertFieldInput,
  assertTypeaheadValues,
} = require('../../support/assertions')
const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')
const {
  ERROR_MESSAGES,
} = require('../../../../../src/client/modules/ExportPipeline/ExportForm/constants')
const {
  fillMultiOptionTypeahead,
  clearTypeahead,
} = require('../../support/form-fillers')
const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results
const { faker } = require('@faker-js/faker')

describe('Export pipeline edit', () => {
  const exportItem = exportItems.results[0]

  context('when editing an export for unknown company id', () => {
    before(() => {
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
    const editPageUrl = urls.exportPipeline.edit(exportItem.id)

    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.intercept('PATCH', `/api-proxy/v4/export/${exportItem.id}`).as(
        'patchExportItemApiRequest'
      )
      cy.visit(editPageUrl)
    })

    context('when verifying the page', () => {
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

      it('should render a form with display a save button', () => {
        cy.get('[data-test=submit-button]').should('have.text', 'Save')
      })

      it('should render a form with a cancel link', () => {
        cy.get('[data-test=cancel-button]')
          .should('have.text', 'Cancel')
          .should('have.attr', 'href', urls.dashboard())
      })

      it('should render a form with saved values in the form fields', () => {
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
        assertTypeaheadValues(
          '[data-test="field-team_members"]',
          exportItem.team_members.map((t) => t.name)
        )
        cy.get('[data-test="field-destination_country"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Destination',
            value: exportItem.destination_country.name,
            isMulti: false,
          })
        })
        cy.get('[data-test="field-notes"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Notes (optional)',
            hint: 'Add further details about the export, such as additional sectors and country regions',
            value: exportItem.notes,
          })
        })
      })
    })

    context('when the form cancel button is clicked', () => {
      it('the form should redirect to the dashboard page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.dashboard())
      })
    })

    context('when the form contains invalid data and is submitted', () => {
      it('the form should display validation error message for mandatory inputs', () => {
        //clear any default values first
        cy.get('[data-test="title-input"]').clear()
        cy.get('[data-test="typeahead-input"]').clear()
        clearTypeahead('[data-test=field-destination_country]')

        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-title"]'),
          ERROR_MESSAGES.title
        )
        assertFieldError(
          cy.get('[data-test="field-owner"]'),
          ERROR_MESSAGES.owner
        )
        assertFieldError(
          cy.get('[data-test="field-destination_country"]'),
          ERROR_MESSAGES.destination_country,
          false
        )
      })

      it('the form should display validation error message for too many team members', () => {
        const advisers = faker.helpers.arrayElements(autoCompleteAdvisers, 6)
        fillMultiOptionTypeahead(
          '[data-test=field-team_members]',
          advisers.map((adviser) => adviser.name)
        )
        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-team_members"]'),
          ERROR_MESSAGES.team_members
        )
      })
    })

    context('when the form contains valid data and is submitted', () => {
      it('the form should stay on the current page', () => {
        cy.get('[data-test=submit-button]').click()

        //While building the form do individual checks, can switch to assertPayload once all fields are added
        cy.wait('@patchExportItemApiRequest').then(({ request }) => {
          expect(request.body).to.have.property('id', exportItem.id)
          expect(request.body).to.have.property(
            'company',
            exportItem.company.id
          )
          expect(request.body).to.have.property('title', exportItem.title)
          expect(request.body).to.have.property('owner', exportItem.owner.id)
          expect(request.body.team_members).to.deep.equal(
            exportItem.team_members.map((x) => x.id)
          )
          expect(request.body).to.have.property(
            'destination_country',
            exportItem.destination_country.id
          )
          expect(request.body).to.have.property('notes', exportItem.notes)
        })

        assertUrl(urls.exportPipeline.edit(exportItem.id))

        assertFlashMessage(`Changes saved to '${exportItem.title}'`)
      })
    })
  })
})
