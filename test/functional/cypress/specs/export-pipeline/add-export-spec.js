const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const {
  assertUrl,
  assertExactUrl,
  assertFlashMessage,
  assertPayload,
  assertFieldTypeahead,
  assertFieldError,
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
const {
  fill,
  fillTypeahead,
  fillMultiOptionTypeahead,
  fillSelect,
  clearTypeahead,
} = require('../../support/form-fillers')
const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results
const { faker } = require('@faker-js/faker')

describe('Export pipeline create', () => {
  context('when adding an export for unknown company id', () => {
    before(() => {
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
    const addPageUrl = `/export/create?companyId=${company.id}`

    context('when verifying the page', () => {
      before(() => {
        cy.visit(addPageUrl)
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

      it('should render a form with display a save button', () => {
        cy.get('[data-test=submit-button]').should('have.text', 'Save')
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
      before(() => {
        cy.visit(addPageUrl)
      })

      it('the form should redirect to the company page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.companies.activity.index(company.id))
      })
    })

    context('when the form contains invalid data and is submitted', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('the form should display validation error message for mandatory inputs', () => {
        //clear any default values first
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
          cy.get('[data-test="field-estimated_export_value_years"]'),
          ERROR_MESSAGES.estimated_export_value_years
        )
        assertFieldError(
          cy.get('[data-test="field-estimated_export_value_amount"]'),
          ERROR_MESSAGES.estimated_export_value_amount,
          false
        )
        it('the form should display validation error message for invalid estimated dates', () => {
          cy.get('[data-test=estimated_win_date-month]').type('65')
          cy.get('[data-test=estimated_win_date-year]').type('-54')
          cy.get('[data-test=submit-button]').click()

          assertFieldError(
            cy.get('[data-test="field-estimated_win_date"]'),
            ERROR_MESSAGES.estimated_win_date.invalid
          )
        })
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

      it('the form should display validation error message for invalid estimated dates', () => {
        fill('[data-test=estimated_win_date-month]', '65')
        fill('[data-test=estimated_win_date-year]', '-54')
        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-estimated_win_date"]'),
          ERROR_MESSAGES.estimated_win_date.invalid
        )
      })
    })

    context(
      'when the form contains valid data and the form is submitted',
      () => {
        before(() => {
          cy.intercept('POST', `/api-proxy/v4/export`).as(
            'postExportItemApiRequest'
          )
          cy.visit(addPageUrl)
        })

        it('the form should redirect to the dashboard page and display a success message', () => {
          const newExport = generateExport()
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
          cy.get('[data-test=estimated_win_date-month]').type('03')
          cy.get('[data-test=estimated_win_date-year]').type('2035')
          fillTypeahead(
            '[data-test=field-destination_country]',
            newExport.destination_country.name
          )
          fill('[data-test=field-notes]', newExport.notes)

          cy.get('[data-test=submit-button]').click()

          assertPayload('@postExportItemApiRequest', {
            title: newExport.title,
            owner: '7d19d407-9aec-4d06-b190-d3f404627f21',
            team_members: [teamMember.id],
            company: company.id,
            estimated_export_value_years:
              newExport.estimated_export_value_years.id,
            estimated_export_value_amount:
              newExport.estimated_export_value_amount,
            estimated_win_date: '2035-03-01T00:00:00',
            destination_country: newExport.destination_country.id,
            notes: newExport.notes,
          })

          assertExactUrl('')
          assertFlashMessage(`'${newExport.title}' created`)
        })
      }
    )
  })
})
