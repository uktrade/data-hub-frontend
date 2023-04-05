const urls = require('../../../../../src/lib/urls')

const {
  assertUrl,
  assertFieldRadios,
  assertFieldSelect,
  assertFieldTextarea,
  assertLocalHeader,
  assertBreadcrumbs,
  assertFlashMessage,
  assertFieldTypeahead,
  assertFieldError,
  assertFieldInput,
  assertTypeaheadValues,
  assertFieldDateShort,
} = require('../../support/assertions')
const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')
const {
  ERROR_MESSAGES,
} = require('../../../../../src/client/modules/ExportPipeline/ExportForm/constants')
const {
  fillMultiOptionTypeahead,
  fillSelect,
  clearTypeahead,
} = require('../../support/form-fillers')
const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results
const { faker } = require('@faker-js/faker')

import { capitalize } from 'lodash'

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
        cy.get('[data-test="field-estimated_export_value_years"]').then(
          (element) => {
            assertFieldSelect({
              element,
              label: 'Year(s)',
              value: exportItem.estimated_export_value_years.name,
              optionsCount: 7,
            })
          }
        )
        cy.get('[data-test="field-estimated_export_value_amount"]').then(
          (element) => {
            assertFieldInput({
              element,
              label: 'Estimated value in GBP',
              value: exportItem.estimated_export_value_amount,
            })
          }
        )
        cy.get('[data-test="field-estimated_win_date"]').then((element) => {
          assertFieldDateShort({
            element,
            label: 'Estimated date for win',
            hint: 'For example 11 2023',
            value: exportItem.estimated_win_date,
          })
        })
        cy.get('[data-test="field-destination_country"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Destination',
            value: exportItem.destination_country.name,
            isMulti: false,
          })
        })
        cy.get('[data-test="field-sector"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Main sector',
            value: exportItem.sector.name,
            isMulti: false,
          })
        })
        cy.get('[data-test="field-export_potential"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Export potential',
            optionsCount: 3,
            value: capitalize(exportItem.export_potential),
          })
        })
        cy.get('[data-test="field-exporter_experience"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Exporter experience (optional)',
            optionsCount: 5,
            value: exportItem.exporter_experience.name,
          })
        })
        cy.get('[data-test="field-notes"]').then((element) => {
          assertFieldTextarea({
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
        clearTypeahead('[data-test=field-owner]')
        fillSelect('[data-test=field-estimated_export_value_years]', 0)
        cy.get('[data-test="estimated-export-value-amount-input"]').clear()
        cy.get('[data-test="estimated_win_date-month"]').clear()
        cy.get('[data-test="estimated_win_date-year"]').clear()
        clearTypeahead('[data-test=field-destination_country]')
        clearTypeahead('[data-test=field-sector]')

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
          cy.get('[data-test="field-estimated_export_value_years"]'),
          ERROR_MESSAGES.estimated_export_value_years
        )
        assertFieldError(
          cy.get('[data-test="field-estimated_export_value_amount"]'),
          ERROR_MESSAGES.estimated_export_value_amount,
          false
        )
        assertFieldError(
          cy.get('[data-test="field-estimated_win_date"]'),
          ERROR_MESSAGES.estimated_win_date.required
        )
        assertFieldError(
          cy.get('[data-test="field-destination_country"]'),
          ERROR_MESSAGES.destination_country,
          false
        )
        assertFieldError(
          cy.get('[data-test="field-sector"]'),
          ERROR_MESSAGES.sector
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

      it('the form should display validation error message for invalid estimated dates', () => {
        cy.get('[data-test=estimated_win_date-month]').type('65')
        cy.get('[data-test=estimated_win_date-year]').type('-54')
        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-estimated_win_date"]'),
          ERROR_MESSAGES.estimated_win_date.invalid
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
            'estimated_export_value_years',
            exportItem.estimated_export_value_years.id
          )
          expect(request.body).to.have.property(
            'estimated_export_value_amount',
            exportItem.estimated_export_value_amount
          )
          expect(request.body).to.have.property(
            'estimated_win_date',
            `${exportItem.estimated_win_date.getFullYear()}-${
              exportItem.estimated_win_date.getMonth() + 1
            }-01T00:00:00`
          )
          expect(request.body).to.have.property(
            'destination_country',
            exportItem.destination_country.id
          )
          expect(request.body).to.have.property('sector', exportItem.sector.id)
          expect(request.body).to.have.property(
            'export_potential',
            exportItem.export_potential
          )
          expect(request.body).to.have.property(
            'exporter_experience',
            exportItem.exporter_experience.id
          )
          expect(request.body).to.have.property('notes', exportItem.notes)
        })

        assertUrl(urls.exportPipeline.edit(exportItem.id))

        assertFlashMessage(`Changes saved to '${exportItem.title}'`)
      })
    })
  })
})
