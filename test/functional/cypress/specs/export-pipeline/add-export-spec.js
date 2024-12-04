import { faker } from '../../../../sandbox/utils/random'
import { contactFaker, contactsListFaker } from '../../fakers/contacts'
import { exportFaker } from '../../fakers/export'
import { companyFaker } from '../../fakers/companies'
import { addNewContact } from '../../support/actions'
import { sectorListFaker } from '../../fakers/sectors'
import { countryListFaker } from '../../fakers/countries'
import urls from '../../../../../src/lib/urls'

import {
  assertUrl,
  assertExactUrl,
  assertFlashMessage,
  assertPayload,
  assertFieldTypeahead,
  assertFieldError,
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldEmpty,
  assertTypeaheadOptionSelected,
} from '../../support/assertions'

import { ERROR_MESSAGES } from '../../../../../src/client/modules/ExportPipeline/ExportForm/constants'

import {
  fill,
  fillTypeahead,
  fillMultiOptionTypeahead,
  fillSelect,
  clearTypeahead,
} from '../../support/form-fillers'

const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results

describe('Export pipeline create', () => {
  beforeEach(() => {
    // Clear the session storage to avoid caching of contact form data in the application sessionStorage
    Cypress.session.clearCurrentSessionData()
  })

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
        Home: urls.exportPipeline.index(),
        Companies: urls.companies.index(),
        'Add export': null,
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when adding an export for known company id', () => {
    const company = companyFaker()
    const addPageUrl = `/export/create?companyId=${company.id}`
    const sectors = sectorListFaker(3)
    const countries = countryListFaker(3)
    const newExport = exportFaker({
      sector: sectors[0],
      destination_country: countries[0],
    })
    const newContact = contactFaker()
    function mockApiAndVisitPage() {
      cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company).as(
        'getCompanyApiRequest'
      )
      cy.visit(addPageUrl)
    }
    context('when verifying the page', () => {
      beforeEach(() => {
        mockApiAndVisitPage()
      })

      it('should render the header', () => {
        assertLocalHeader('Add export')
        cy.get('[data-test="subheading"]').should('have.text', company.name)
      })

      it('should render the add export breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.exportPipeline.index(),
          Companies: urls.companies.index(),
          [company.name]: urls.companies.activity.index(company.id),
          'Add export': null,
        })
      })

      it('should render a form with display a save button', () => {
        cy.get('[data-test=submit-button]').should('have.text', 'Add export')
      })

      it('should render a form with a cancel link', () => {
        cy.get('[data-test=cancel-button]')
          .should('have.text', 'Cancel')
          .should(
            'have.attr',
            'href',
            urls.companies.activity.index(company.id)
          )
      })

      it('should render a form with the default values set', () => {
        cy.get('[data-test="field-owner"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Owner',
            value: 'DBT Staff',
            isMulti: false,
          })
        })
      })
    })

    context('when the form cancel button is clicked', () => {
      beforeEach(() => {
        mockApiAndVisitPage()
      })

      it('the form should redirect to the company page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.companies.activity.index(company.id))
      })
    })

    context('when the form is populated but not submitted', () => {
      beforeEach(() => {
        mockApiAndVisitPage()
      })

      it('leaving and returning to the page should not keep any values', () => {
        fill('[data-test=title-input]', newExport.title)
        fill('[data-test=estimated_win_date-month]', '09')
        fill('[data-test=estimated_win_date-year]', '2029')
        cy.get('[data-test="add-a-new-contact-link"').click()
        addNewContact(newContact)
        cy.visit('/')
        cy.visit(addPageUrl)
        assertFieldEmpty('[data-test=title-input]')
        assertFieldEmpty('[data-test=estimated_win_date-month]')
        assertFieldEmpty('[data-test=estimated_win_date-year]')
      })
    })

    context('when the form contains invalid data and is submitted', () => {
      beforeEach(() => {
        mockApiAndVisitPage()
      })

      it('the form should display validation error message for mandatory inputs', () => {
        //clear any default values first
        clearTypeahead('[data-test=field-owner]')
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
          cy.get('[data-test="field-destination_country"]'),
          ERROR_MESSAGES.destination_country,
          false
        )
        assertFieldError(
          cy.get('[data-test="field-status"]'),
          ERROR_MESSAGES.status
        )
        assertFieldError(
          cy.get('[data-test="field-sector"]'),
          ERROR_MESSAGES.sector
        )
        assertFieldError(
          cy.get('[data-test="field-status"]'),
          ERROR_MESSAGES.status
        )
        assertFieldError(
          cy.get('[data-test="field-export_potential"]'),
          ERROR_MESSAGES.export_potential
        )
        assertFieldError(
          cy.get('[data-test="field-contacts"]'),
          ERROR_MESSAGES.contacts,
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
      context(
        'when the estimated dates field has form validation errors',
        () => {
          it('the form should display validation error message for invalid estimated dates', () => {
            fill('[data-test=estimated_win_date-month]', '65')
            fill('[data-test=estimated_win_date-year]', '-54')
            cy.get('[data-test=submit-button]').click()

            assertFieldError(
              cy.get('[data-test="field-estimated_win_date"]'),
              ERROR_MESSAGES.estimated_win_date.invalid
            )
          })

          it('the form should display validation error message 2 digit estimated date', () => {
            cy.get('[data-test=estimated_win_date-month]').clear()
            cy.get('[data-test=estimated_win_date-year]').clear()

            fill('[data-test=estimated_win_date-month]', '10')
            fill('[data-test=estimated_win_date-year]', '23')
            cy.get('[data-test=submit-button]').click()

            assertFieldError(
              cy.get('[data-test="field-estimated_win_date"]'),
              'Enter a year as 4 digits'
            )
          })
        }
      )

      context('when the currency field has form validation errors', () => {
        const fieldElement = '[data-test="field-estimated_export_value_amount"]'
        const currencyInput =
          '[data-test="estimated-export-value-amount-input"]'
        const saveButton = '[data-test=submit-button]'

        it('should display an error when the field is empty', () => {
          cy.get(saveButton).click()
          assertFieldError(
            cy.get(fieldElement),
            ERROR_MESSAGES.estimated_export_value_empty,
            false
          )
        })
        it('should display an error when the field value is negative', () => {
          cy.get(currencyInput).type('-5000')
          cy.get(saveButton).click()
          assertFieldError(
            cy.get(fieldElement),
            ERROR_MESSAGES.estimated_export_value_amount,
            false
          )
        })

        it('should display an error when the field value is greater than 19 digits', () => {
          cy.get(currencyInput).clear()
          cy.get(currencyInput).type('12345678912345678912')
          cy.get(saveButton).click()
          assertFieldError(
            cy.get(fieldElement),
            ERROR_MESSAGES.estimated_export_value_amount,
            false
          )
        })

        it('should display an error when the field value is non numerical', () => {
          cy.get(currencyInput).clear()
          cy.get(currencyInput).type('ABC')
          cy.get(saveButton).click()
          assertFieldError(
            cy.get(fieldElement),
            ERROR_MESSAGES.estimated_export_value_amount,
            false
          )
        })
      })
    })

    context(
      'when the form contains valid data and the form is submitted',
      () => {
        const contacts = contactsListFaker((length = 3))

        beforeEach(() => {
          cy.intercept('GET', `/api-proxy/v4/metadata/country*`, countries)
          cy.intercept('GET', `/api-proxy/v4/metadata/sector*`, sectors)
          cy.intercept('POST', `/api-proxy/v4/export`, {
            id: newExport.id,
            title: newExport.title,
          }).as('postExportItemApiRequest')
          cy.intercept('POST', `/api-proxy/v4/contact`, newContact).as(
            'postContactApiRequest'
          )
          cy.intercept(
            'GET',
            `/api-proxy/v4/contact?company_id=${company.id}`,
            { count: 4, results: [newContact, ...contacts] }
          ).as('getContactApiRequest')

          mockApiAndVisitPage()
        })

        it('the form should redirect to the export tab on the dashboard page and display a success message', () => {
          const teamMember = faker.helpers.arrayElement(autoCompleteAdvisers)

          fill('[data-test=title-input]', newExport.title)
          fillTypeahead('[data-test=field-team_members]', teamMember.name)
          fillSelect(
            '[data-test=field-estimated_export_value_years]',
            newExport.estimated_export_value_years.id
          )
          fill(
            '[data-test=estimated-export-value-amount-input]',
            newExport.estimated_export_value_amount
          )
          fill('[data-test=estimated_win_date-month]', '03')
          fill('[data-test=estimated_win_date-year]', '2035')
          fillTypeahead(
            '[data-test=field-destination_country]',
            newExport.destination_country.name
          )
          fillTypeahead('[data-test=field-sector]', newExport.sector.name)
          cy.get('[name="status"]').check(newExport.status)
          cy.get('[name="export_potential"]').check(newExport.export_potential)

          cy.get('[name="exporter_experience"]').check(
            newExport.exporter_experience.id
          )
          fill('[data-test=field-notes]', newExport.notes)
          cy.get('[data-test="add-a-new-contact-link"').click()
          addNewContact(newContact)
          assertFlashMessage(
            `You have successfully added a new contact ${newContact.name}`
          )
          assertTypeaheadOptionSelected({
            element: '[data-test=field-contacts]',
            expectedOption: newContact.name,
          })

          cy.window()
            .its('sessionStorage')
            .invoke('getItem', 'exportForm')
            .should('exist')

          cy.get('[data-test=submit-button]').click()

          assertPayload('@postExportItemApiRequest', {
            title: newExport.title,
            owner: '7d19d407-9aec-4d06-b190-d3f404627f21',
            team_members: [teamMember.id],
            company: { id: company.id, name: company.name },
            estimated_export_value_years:
              newExport.estimated_export_value_years.id,
            estimated_export_value_amount:
              newExport.estimated_export_value_amount,
            estimated_win_date: '2035-03-01',
            destination_country: newExport.destination_country.id,
            sector: newExport.sector.id,
            status: newExport.status,
            export_potential: newExport.export_potential,
            contacts: [newContact.id],
            exporter_experience: newExport.exporter_experience.id,
            notes: newExport.notes,
          })

          assertExactUrl(urls.exportPipeline.index())
          assertFlashMessage(`'${newExport.title}' created`)

          cy.window()
            .its('sessionStorage')
            .invoke('getItem', 'exportForm')
            .should('not.exist')
        })
      }
    )
  })
})
