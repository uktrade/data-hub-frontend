import { decimal } from '../../../../../src/client/utils/number-utils'
import { addNewContact } from '../../support/actions'

import { contactFaker } from '../../fakers/contacts'
import { exportFaker } from '../../fakers/export'
import { sectorListFaker } from '../../fakers/sectors'
import { countryListFaker } from '../../fakers/countries'

const { faker } = require('@faker-js/faker')

const { capitalize } = require('lodash')

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
  assertPayload,
  assertFieldRadiosStrict,
  assertTypeaheadOptionSelected,
} = require('../../support/assertions')
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

describe('Export pipeline edit', () => {
  beforeEach(() => {
    // Clear the session storage to avoid caching of contact form data in the application sessionStorage
    Cypress.session.clearCurrentSessionData()
  })

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
        Home: urls.exportPipeline.index(),
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when editing an export for known company id', () => {
    const sectors = sectorListFaker(3)
    const countries = countryListFaker(3)
    const exportItem = exportFaker({
      sector: sectors[0],
      destination_country: countries[0],
      exporter_experience: {
        id: '8937c359-157e-41dd-8520-679383847ea0',
        order: 20,
        name: 'Exported in the last 12 months, but has not won an export order by having an export plan',
      },
    })
    const editPageUrl = urls.exportPipeline.edit(exportItem.id)

    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/metadata/country`, countries)
      cy.intercept('GET', `/api-proxy/v4/metadata/sector`, sectors)
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')

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
          Home: urls.exportPipeline.index(),
          [exportItem.title]: urls.exportPipeline.details(exportItem.id),
          'Edit export': null,
        })
      })

      it('should render a form with display a save button', () => {
        cy.get('[data-test=submit-button]').should('have.text', 'Save')
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
              value: decimal(exportItem.estimated_export_value_amount),
            })
          }
        )
        cy.get('[data-test="field-estimated_win_date"]').then((element) => {
          assertFieldDateShort({
            element,
            label: 'Estimated date for win',
            hint: 'For example 06 2023',
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
        cy.get('[data-test="field-status"]').then((element) => {
          assertFieldRadios({
            element,
            label: 'Export status',
            optionsCount: 3,
            value: capitalize(exportItem.status),
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
        assertTypeaheadValues(
          '[data-test="field-contacts"]',
          exportItem.contacts.map((t) => t.name)
        )
        assertFieldRadiosStrict({
          inputName: 'exporter_experience',
          legend: 'Exporter experience (optional)',
          options: [
            'Never exported',
            'Exported before, but no exports in the last 12 months',
            'Exported in the last 12 months, but has not won an export order by having an export plan',
            'An exporter with a new export win, but has not exported to this country within the last 3 years',
            'An exporter that DBT are helping maintain and grow their exports',
          ],
          selectedIndex: 2,
        })
        cy.get('[data-test="field-notes"]').then((element) => {
          assertFieldTextarea({
            element,
            label: 'Notes (optional)',
            hint: 'Add further details about the export, such as additional sectors and country regions.',
            value: exportItem.notes,
          })
        })
      })
    })

    context('when the form cancel button is clicked', () => {
      it('the form should redirect to the details page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.exportPipeline.details(exportItem.id))
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
          ERROR_MESSAGES.estimated_export_value_empty,
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

    context('when the a new contact is added', () => {
      const newContact = contactFaker()
      beforeEach(() => {
        cy.intercept('POST', `/api-proxy/v4/contact`, newContact).as(
          'postContactApiRequest'
        )
      })

      it('should be added to existing list of contacts', () => {
        cy.get('[data-test="add-a-new-contact-link"').click()
        addNewContact(newContact)
        exportItem.contacts.map((x) =>
          assertTypeaheadOptionSelected({
            element: '[data-test=field-contacts]',
            expectedOption: x.name,
          })
        )
        assertTypeaheadOptionSelected({
          element: '[data-test=field-contacts]',
          expectedOption: newContact.name,
        })
      })
    })

    context('when the form contains valid data and is submitted', () => {
      beforeEach(() => {
        cy.intercept('PATCH', `/api-proxy/v4/export/${exportItem.id}`, {
          title: exportItem.title,
        }).as('patchExportItemApiRequest')
      })
      it('the form should redirect to the export details page and display flash message', () => {
        cy.get('[data-test=submit-button]').click()

        assertPayload('@patchExportItemApiRequest', {
          id: exportItem.id,
          title: exportItem.title,
          owner: exportItem.owner.id,
          team_members: exportItem.team_members.map((x) => x.id),
          company: { id: exportItem.company.id, name: exportItem.company.name },
          estimated_export_value_years:
            exportItem.estimated_export_value_years.id,
          estimated_export_value_amount:
            exportItem.estimated_export_value_amount,
          estimated_win_date: `${exportItem.estimated_win_date.getFullYear()}-${
            exportItem.estimated_win_date.getMonth() + 1
          }-01`,
          destination_country: exportItem.destination_country.id,
          sector: exportItem.sector.id,
          status: exportItem.status,
          export_potential: exportItem.export_potential,
          contacts: exportItem.contacts.map((x) => x.id),
          exporter_experience: exportItem.exporter_experience.id,
          notes: exportItem.notes,
        })

        assertUrl(urls.exportPipeline.details(exportItem.id))

        assertFlashMessage(`Changes saved to '${exportItem.title}'`)
      })
    })
  })
})
